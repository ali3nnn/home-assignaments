import { handler } from '../main';

describe("handler", () => {

    it('should fail validation with less than 3 soldiers', async () => {
        expect(await handler(2)).rejects;
    })

    it('should generate 1 soldier for each troop', async () => {
        expect(await handler(3)).toEqual({ Spearmen: 1, Swordsmen: 1, Archers: 1 });
    })

    it('should generate 100 soldiers in total', async () => {
        const result = await handler(100);
        // @ts-ignore
        const troopSize = Object.values(result).reduce((a, b) => a + b)
        expect(troopSize).toBe(100);
    })

    it('should generate 500 soldiers in total', async () => {
        const result = await handler(500);
        // @ts-ignore
        const troopSize = Object.values(result).reduce((a, b) => a + b)
        expect(troopSize).toBe(500);
    })

})
