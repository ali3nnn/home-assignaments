export default class TroopsController {
    size: number;
    troops: object;
    troopsName: string[];
    constructor(size: any);
    generateRandomNumberBetween(min: any, max: any): number;
    sumUpTheTroops(): any;
    shuffleTroopsName(): void;
    generateTroops(): object;
}
