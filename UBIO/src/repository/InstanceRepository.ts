import Instance from "../models/Instance.model";

export default class InstanceRepository {

    async findBy(key, value) {
        return await Instance.find({
            [key]: value
        }).lean()
    }

    async findById(instanceId) {
        return await Instance.findById(instanceId).lean()
    }

    async findByIdAndUpdate(instanceId, payload) {
        return await Instance.findByIdAndUpdate(instanceId, payload, { new: true }).lean()
    }

    async findAllByGroups() {
        return await Instance.aggregate([
            { "$sort": { "createdAt": 1, "updatedAt": 1 } },        // Sorting in asscending order by createdAt and updatedAt fields

            {
                "$group": {
                    "_id": "$group",                                // Grouping results by the "group" field
                    "instances": { "$sum": 1 },                     // Counting the instances in each group
                    "createdAt": { "$first": "$createdAt" },        // Adding createdAt value from the earliest pulse
                    "lastUpdatedAt": { "$last": "$updatedAt" }      // Adding updateAt value from the latest pulse
                }
            },
            {
                $set: { group: "$_id" }                             // Creating the group key in the response

            },
            {
                $project: { _id: 0 }                                // Hiding the _id from the response
            }
        ])
    }

    async findAll() {
        return await Instance.find().lean()
    }

    async create(payload) {
        await Instance.create(payload)
    }

    async findByIdAndDelete(id) {
        return await Instance.findByIdAndDelete(id).lean()
    }

    async deleteMany(condition) {
        return await Instance.deleteMany(condition)
    }

    async findByIdCondition(condition) {
        return await Instance.find(condition).lean()
    }
    
    async exists(id) {
        return await Instance.exists({ _id: id }).lean()
    }

}