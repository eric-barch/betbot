export class SpreadOdds {
    private awaySpread: number;
    private awayPrice: number;
    private homeSpread: number;
    private homePrice: number;

    constructor() {
        this.awaySpread = 0;
        this.awayPrice = 0;
        this.homeSpread = 0;
        this.homePrice = 0;
    }

    public getAwaySpread() {
        return this.awaySpread;
    }

    public getAwayPrice() {
        return this.awayPrice;
    }

    public getHomeSpread() {
        return this.homeSpread;
    }

    public getHomePrice() {
        return this.homePrice;
    }

    public setAwaySpread({
        awaySpread,
    }: {
        awaySpread: number | string,
    }) {
        if (typeof awaySpread === 'number') {
            this.awaySpread = awaySpread;
        } else if (typeof awaySpread === 'string'){
            this.awaySpread = Number(awaySpread);
        }
    }

    public setAwayPrice({
        awayPrice,
    }: {
        awayPrice: number | string,
    }) {
        if (typeof awayPrice === 'number') {
            this.awayPrice = awayPrice;
        } else if (typeof awayPrice === 'string'){
            this.awayPrice = Number(awayPrice);
        }
    }

    public setHomeSpread({
        homeSpread,
    }: {
        homeSpread: number,
    }) {
        this.homeSpread = homeSpread;
    }

    public setHomePrice({
        homePrice,
    }: {
        homePrice: number,
    }) {
        this.homePrice = homePrice;
    }    
}