export class MoneyOdds {
    private awayPrice: number;
    private homePrice: number;

    constructor() {
        this.awayPrice = 0;
        this.homePrice = 0;
    }

    public getAwayPrice() {
        return this.awayPrice;
    }
    public getHomePrice() {
        return this.homePrice;
    }
    public setAwayPrice({
        awayPrice,
    }: {
        awayPrice: number | string,
    }) {
        this.awayPrice = Number(awayPrice);
    }

    public setHomePrice({
        homePrice,
    }: {
        homePrice: number | string,
    }) {
        this.homePrice = Number(homePrice);
    }
}