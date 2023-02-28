export class SpreadOdds {
    private awaySpread: number;
    private awayPrice: number;
    private homeSpread: number;
    private homePrice: number;

    constructor({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        this.awaySpread = 0;
        this.awayPrice = 0;
        this.homeSpread = 0;
        this.homePrice = 0;
    }

    public getAwaySpread({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.awaySpread;
    }

    public getAwayPrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.awayPrice;
    }

    public getHomeSpread({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.homeSpread;
    }

    public getHomePrice({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.homePrice;
    }

    public setAwaySpread({
        awaySpread,
        verbose = false,
    }: {
        awaySpread: number | string,
        verbose?: boolean,
    }) {
        if (typeof awaySpread === 'number') {
            this.awaySpread = awaySpread;
        } else if (typeof awaySpread === 'string'){
            this.awaySpread = Number(awaySpread);
        }
        verbose ? console.log(`\tspreadOdds.awaySpread set to ${this.getAwaySpread()}`) : null;
    }

    public setAwayPrice({
        awayPrice,
        verbose = false,
    }: {
        awayPrice: number | string,
        verbose?: boolean,
    }) {
        if (typeof awayPrice === 'number') {
            this.awayPrice = awayPrice;
        } else if (typeof awayPrice === 'string'){
            this.awayPrice = Number(awayPrice);
        }
        verbose ? console.log(`\tspreadOdds.awayPrice set to ${this.getAwayPrice()}`) : null;
    }

    public setHomeSpread({
        homeSpread,
        verbose = false,
    }: {
        homeSpread: number,
        verbose?: boolean,
    }) {
        this.homeSpread = homeSpread;
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