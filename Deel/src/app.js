const express = require('express');
const bodyParser = require('body-parser');
const Op = require('sequelize').Op;

const { seed } = require('../scripts/seedDb');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { isValidDate } = require('./utils')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const contract = await Contract.findOne({
        where: {
            id, [Op.or]: [
                { ContractorId: req.profile.id },
                { ClientId: req.profile.id }
            ]
        }
    })
    if (!contract) return res.status(404).send()
    res.status(200).json(contract)
})

/**
 * @returns contracts for user
 */
app.get('/contracts', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models')
    const contracts = await Contract.findAll({
        where: {
            [Op.or]: [
                { ContractorId: req.profile.id },
                { ClientId: req.profile.id }
            ], status: { [Op.ne]: 'terminated' }
        }
    })
    if (!contracts) return res.status(404).send()
    res.json(contracts)
})

/**
 * @returns unpaid jobs for user's active contracts
 */
app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const { Job, Contract } = req.app.get('models')

    const jobs = await Job.findAll({
        include: {
            model: Contract,
            as: 'Contract',
            where: {
                status: 'in_progress',
                [Op.or]: [
                    { ContractorId: req.profile.id },
                    { ClientId: req.profile.id }
                ]
            }
        },
        where: { paid: null }
    })

    if (!jobs) return res.status(404).send()
    res.json(jobs)
})

/**
 * @returns client pays the contractors for job
 */
app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const client = req.profile
    const t = await sequelize.transaction()

    try {
        if (client.type === 'contractor') {
            throw 'The user is not a client'
        }

        const job = await Job.findOne({
            include: {
                model: Contract,
                as: 'Contract',
                where: {
                    status: 'in_progress',
                    ClientId: client.id
                }
            },
            where: {
                id: req.params.job_id,
                paid: null
            }
        })

        if (!job) {
            return res.status(404).send(`Job not found`)
        }

        if (client.balance < job.price) {
            throw "Client doesn't have enough balance"
        }

        const contractor = await Profile.findOne({
            where: {
                id: job.Contract.ContractorId
            }
        })

        // Update the job as paid
        await Job.update({
            paid: true,
            paymentDate: new Date()
        }, {
            where: {
                id: req.params.job_id
            }
        }, { transaction: t })

        // Update the contractor's balance
        await Profile.update({
            balance: contractor.balance + job.price
        }, {
            where: {
                id: job.Contract.ContractorId
            }
        }, { transaction: t })

        // Update the client's balance
        await Profile.update({
            balance: client.balance - job.price
        }, {
            where: {
                id: client.id
            }
        }, { transaction: t })

        // Run the transaction
        await t.commit()

        res.send(`Job ${req.params.job_id} has been paid`)

    } catch (error) {
        await t.rollback()
        res.status(500).send(error)
    }

})

/**
 * @returns deposit money for client
 */
app.post('/balances/deposit/:userId', getProfile, async (req, res) => {
    const amount = Number(req.query.amount)
    const { Job, Contract, Profile } = req.app.get('models')
    const client = req.profile

    if (req.params.userId != client.id) {
        return res.status(400).send('Incorrect user id')
    }

    if (!amount) {
        return res.status(400).send('Invalid amount')
    }

    if (client.type == 'contractor') {
        return res.status(400).send('User is not a client')
    }

    const unpaidJobs = await Job.findAll({
        include: {
            model: Contract,
            as: 'Contract',
            where: {
                status: 'in_progress',
                ClientId: client.id
            }
        },
        where: { paid: null }
    })

    if (!unpaidJobs.length) {
        return res.status(200).send('Client has paid all his jobs')
    }

    const priceOfUnpaidJobs = unpaidJobs.reduce((acc, job) => {
        return acc + job.price
    }, 0)

    if (amount > priceOfUnpaidJobs * 0.25) {
        return res.status(400).send("You cannot deposit more than 25% of your total jobs to pay")
    }

    await Profile.update({
        balance: client.balance + amount
    }, {
        where: {
            id: client.id
        }
    })

    res.status(200).send({
        old_balance: client.balance,
        new_balance: (await Profile.findOne({ where: { id: client.id } })).balance
    })

})

app.get('/admin/best-profession', async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')

    const startDate = new Date(req.query.start)
    const endDate = new Date(req.query.end)

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return res.status(400).send('Invalid date')
    }

    const jobs = await Job.findAll({
        where: {
            paymentDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            }
        },
        include: {
            model: Contract,
            as: 'Contract',
            attributes: ['ContractorId'],
            include: {
                model: Profile,
                as: 'Contractor',
                attributes: ['profession']
            },
        },
        group: 'Contract.Contractor.profession',
        attributes: [
            [sequelize.fn('sum', sequelize.col('price')), 'total_price']
        ],
        order: [
            [sequelize.col('total_price'), 'DESC']
        ]
    })

    if (!jobs) {
        return res.send(404).send('Jobs not found!')
    }

    res.status(200).send(jobs[0].Contract.Contractor.profession)
})

app.get('/admin/best-clients', async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')

    const startDate = new Date(req.query.start)
    const endDate = new Date(req.query.end)

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return res.status(400).send('Invalid date')
    }

    const clientsData = await Job.findAll({
        where: {
            paymentDate: {
                [Op.gte]: startDate,
                [Op.lte]: endDate,
            }
        },
        include: {
            model: Contract,
            as: 'Contract',
            attributes: ['ClientId'],
            include: {
                model: Profile,
                as: 'Client',
                attributes: [
                    'firstName', 'lastName'
                ]
            },
        },
        group: 'Contract.ClientId',
        attributes: [
            [sequelize.fn('sum', sequelize.col('price')), 'paid']
        ],
        order: [
            [sequelize.col('paid'), 'DESC']
        ],
        limit: req.query.limit || 2
    })

    if (!clientsData) {
        return res.send(404).send('Jobs not found!')
    }

    const customResults = clientsData.map(clientData => {
        return {
            id: clientData.Contract.ClientId,
            fullName: clientData.Contract.Client.firstName + ' ' + clientData.Contract.Client.lastName,
            paid: clientData.paid
        }
    })

    res.status(200).send(customResults)

})

module.exports = app;
