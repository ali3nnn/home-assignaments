import { IsInt, Min } from 'class-validator'

export default class TroopsController {

    @Min(3)
    @IsInt()
    size: number;

    troops: object;

    troopsName: string[];

    constructor(size) {
        this.size = size;
        this.troops = {
            'Spearmen': 0,
            'Swordsmen': 0,
            'Archers': 0
        }
        this.troopsName = Object.keys(this.troops)
    }

    generateRandomNumberBetween(min, max) {
        return Math.floor(min + Math.random() * (max - min))
    }

    sumUpTheTroops() {
        return Object.values(this.troops).reduce((a, b) => a + b);
    }

    shuffleTroopsName() {
        this.troopsName.sort(() => Math.random() > 0.5 ? 1 : -1)
    }

    generateTroops() {
        const numberOfTroops = Object.keys(this.troops).length;
        const max = this.size;
        this.shuffleTroopsName()

        this.troopsName.forEach((troop, troopIndex) => {
            if (troopIndex < numberOfTroops - 1) {
                this.troops[troop] = this.generateRandomNumberBetween(1, max - (numberOfTroops - (troopIndex + 1)) - this.sumUpTheTroops())
            } else {
                this.troops[troop] = max - this.sumUpTheTroops()
            }
        })

        return this.troops
    }

}