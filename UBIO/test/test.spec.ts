import "reflect-metadata"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, test } from '@jest/globals';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../src/app';
import * as db from "../src/database";

describe('REST Endpoints', () => {

    const group = "testing-group"
    const instanceId1 = uuidv4()
    const instanceId2 = uuidv4()
    const instanceId3 = uuidv4()

    beforeAll(async () => {
        await db.connect('ubio-testing');
    })

    afterAll(async () => {
        await db.disconnect();
    })

    beforeEach(async () => {
        // add dummy data into DB
        await request(app).post(`/${group}/${instanceId1}`);
        await request(app).post(`/${group}/${instanceId2}`);
    })

    afterEach(async () => {
        // delete dummy data from DB
        await request(app).delete(`/${group}/${instanceId1}`);
        await request(app).delete(`/${group}/${instanceId2}`);
        await request(app).delete(`/${group}/${instanceId3}`);
    })

    it('should describe all groups', async () => {
        const response = await request(app).get("/");

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBe(1)
        expect(response.body[0].instances).toBe(2)
        expect(Object.keys(response.body[0])).toEqual(["instances", "createdAt", "lastUpdatedAt", "group"])
    });

    it('should update an instance', async () => {
        const response = await request(app).post(`/${group}/${instanceId1}`);

        expect(response.status).toBe(200)
        expect(response.body.id).toBe(instanceId1)
    });

    it('should create an instance', async () => {
        const response = await request(app).post(`/${group}/${instanceId3}`);

        expect(response.status).toBe(201)
        expect(response.body.id).toBe(instanceId3)
    });

    it('should unregister one instance', async () => {
        const response = await request(app).delete(`/${group}/${instanceId2}`);

        expect(response.status).toBe(200)
    });

    it('should describe one group', async () => {
        const response = await request(app).get(`/${group}`);

        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: instanceId1,
                    group
                }),
                expect.objectContaining({
                    id: instanceId2,
                    group
                })
            ])
        )
    });

});