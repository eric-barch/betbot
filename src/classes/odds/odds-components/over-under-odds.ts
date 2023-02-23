export class OverUnderOdds {
    private overUnder: number;
    private overPrice: number;
    private underPrice: number;

    constructor({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        this.overUnder = 0;
        this.overPrice = 0;
        this.underPrice = 0;
    }

    public getOverUnder({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.overUnder;
    }

    public getOverPrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.overPrice;
    }

    public getUnderPrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.underPrice;
    }

    public setOverUnder({
        overUnder,
        verbose = false,
    }: {
        overUnder: number,
        verbose?: boolean,
    }) {
        this.overUnder = overUnder;
    }

    public setOverPrice({
        overPrice,
        verbose = false,
    }: {
        overPrice: number,
        verbose?: boolean,
    }) {
        this.overPrice = overPrice;
    }

    public setUnderPrice({
        underPrice,
        verbose = false,
    }: {
        underPrice: number,
        verbose?: boolean,
    }) {
        this.underPrice = underPrice;
    }
}