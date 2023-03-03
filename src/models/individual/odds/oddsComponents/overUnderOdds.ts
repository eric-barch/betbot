export class OverUnderOdds {
    private overUnder: number;
    private overPrice: number;
    private underPrice: number;

    constructor() {
        this.overUnder = 0;
        this.overPrice = 0;
        this.underPrice = 0;
    }

    public getOverUnder() {
        return this.overUnder;
    }

    public getOverPrice() {
        return this.overPrice;
    }

    public getUnderPrice() {
        return this.underPrice;
    }

    public setOverUnder({
        overUnder,
    }: {
        overUnder: number,
    }) {
        this.overUnder = overUnder;
    }

    public setOverPrice({
        overPrice,
    }: {
        overPrice: number,
    }) {
        this.overPrice = overPrice;
    }

    public setUnderPrice({
        underPrice,
    }: {
        underPrice: number,
    }) {
        this.underPrice = underPrice;
    }
}