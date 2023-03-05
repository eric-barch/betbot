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
        overUnder: number | string,
    }) {
        this.overUnder = Number(overUnder);
    }

    public setOverPrice({
        overPrice,
    }: {
        overPrice: number | string,
    }) {
        this.overPrice = Number(overPrice);
    }

    public setUnderPrice({
        underPrice,
    }: {
        underPrice: number | string,
    }) {
        this.underPrice = Number(underPrice);
    }
}