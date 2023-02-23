export class MoneyOdds {
    private awayPrice: number;
    private homePrice: number;

    constructor({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        this.awayPrice = 0;
        this.homePrice = 0;
    }

    public getAwayPrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.awayPrice;
    }
    public getHomePrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.homePrice;
    }
    public setAwayPrice({
        awayPrice,
        verbose = false,
    }: {
        awayPrice: number,
        verbose?: boolean,
    }) {
        this.awayPrice = awayPrice;
    }

    public setHomePrice({
        homePrice,
        verbose = false,
    }: {
        homePrice: number,
        verbose?: boolean,
    }) {
        this.homePrice = homePrice;
    }
}