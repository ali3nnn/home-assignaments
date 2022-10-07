import TroopsController from "../controller/controller";

describe("TroopsController", () => {

    it('generateRandomNumberBetween', () => {
        let controller = new TroopsController(167)
        let generatedNumbers: number[] = []

        let iteration = 100;
        while (iteration-- > 0) {
            generatedNumbers.push(controller.generateRandomNumberBetween(7, 10))
        }

        expect(generatedNumbers.length).toBe(100)
        expect([...new Set(generatedNumbers)].sort()).toEqual([...new Set([7, 8, 9])])

    })

    it("sumUpTheTroops", () => {
        const controller = new TroopsController(167)
        const troops = {
            'Spearmen': 1,
            'Swordsmen': 2,
            'Archers': 3
        }

        const sum = controller.sumUpTheTroops.call({ troops })

        expect(sum).toBe(6)
    })

    it("shuffleTroopsName", () => {
        const controller = new TroopsController(167)
        const troopsName = Object.keys(controller.troops)

        controller.shuffleTroopsName()

        expect(controller.troopsName.length).toEqual(troopsName.length)
    })

    it("generateTroops", () => {
        const controller = new TroopsController(167)
        const initialTroopSize = controller.sumUpTheTroops()

        controller.generateTroops()
        const finalTroopSize = controller.sumUpTheTroops()

        expect(initialTroopSize).toBe(0)
        expect(finalTroopSize).toBe(controller.size)
        expect(Object.values(controller.troops).filter(v => v <= 0).length).toBe(0)
    })

})
