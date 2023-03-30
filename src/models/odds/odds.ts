import * as puppeteer from 'puppeteer';

import * as models from '../../models';

export class Odds {
    private exchange: models.Exchange | null;
    private game: models.Game | null;
    private baseHandle: puppeteer.ElementHandle | null;
    private spreadOdds: SpreadOdds;
    private moneyOdds: MoneyOdds;
    private overUnderOdds: OverUnderOdds;
    private sequelizeInstance: models.OddsSequelizeInstance | null;
    private updatedAt: Date | null;

    constructor({
        exchange,
        game,
    }: {
        exchange?: models.Exchange,
        game?: models.Game,
    } = {}) {
        if (exchange) {
            this.exchange = exchange;
        } else {
            this.exchange = null;
        }

        if (game) {
            this.game = game;
        } else {
            this.game = null;
        }

        this.baseHandle = null;

        this.spreadOdds = new SpreadOdds();
        this.moneyOdds = new MoneyOdds();
        this.overUnderOdds = new OverUnderOdds();

        this.sequelizeInstance = null;

        this.updatedAt = null;
    }

    public async initialize() {
        this.sequelizeInstance = new models.OddsSequelizeInstance({odds: this});
        await this.sequelizeInstance.initialize();
    }

    public matchesByExchangeAndGame({
        exchange,
        game,
    }:{
        exchange: models.Exchange,
        game: models.Game,
    }) {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }

        return false;
    }

    public getBaseHandle() {
        if (this.baseHandle === null) {
            throw new Error(`${this.constructor.name}.${this.getBaseHandle.name} failed. BaseHandle is null.`);
        } else {
            return this.baseHandle;
        }
    }

    public getGame() {
        if (this.game === null) {
            throw new Error(`${this.constructor.name}.${this.getGame.name} failed. Game is null.`);
        } else {
            return this.game;
        }
    }

    public getExchange() {
        if (this.exchange === null) {
            throw new Error(`${this.constructor.name}.${this.getExchange.name} failed. Exchange is null.`);
        } else {
            return this.exchange;
        }
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }

    public getSpreadOdds() {
        return this.spreadOdds;
    }

    public getMoneyOdds() {
        return this.moneyOdds;
    }

    public getOverUnderOdds() {
        return this.overUnderOdds;
    }

    public setBaseHandle({
        baseHandle,
    }: {
        baseHandle: puppeteer.ElementHandle,
    }) {
        this.baseHandle = baseHandle;
    }

    public setUpdatedAt({
        updatedAt,
    }: {
        updatedAt: Date,
    }) {
        this.updatedAt = updatedAt;
    }
}

class SpreadOdds {
    private awaySpread: number | null;
    private awayPrice: number | null;
    private homeSpread: number | null;
    private homePrice: number | null;

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
        awaySpread: number | string | null,
    }) {
        if (awaySpread === null) {
            this.awaySpread = null;
        } else {
            this.awaySpread = Number(awaySpread);
        }
    }

    public setAwayPrice({
        awayPrice,
    }: {
        awayPrice: number | string | null,
    }) {
        if (awayPrice === null) {
            this.awayPrice = null;
        } else {
            this.awayPrice = Number(awayPrice);
        }
    }

    public setHomeSpread({
        homeSpread,
    }: {
        homeSpread: number | string | null,
    }) {
        if (homeSpread === null) {
            this.homeSpread = null;
        } else {
            this.homeSpread = Number(homeSpread);
        }
    }

    public setHomePrice({
        homePrice,
    }: {
        homePrice: number | string | null,
    }) {
        if (homePrice === null) {
            this.homePrice = null;
        } else {
            this.homePrice = Number(homePrice);
        }
    }    
}

class MoneyOdds {
    private awayPrice: number | null;
    private homePrice: number | null;

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
        awayPrice: number | string | null,
    }) {
        if (awayPrice === null) {
            this.awayPrice = null;
        } else {
            this.awayPrice = Number(awayPrice);
        }
    }

    public setHomePrice({
        homePrice,
    }: {
        homePrice: number | string | null,
    }) {
        if (homePrice === null) {
            this.homePrice = null;
        } else {
            this.homePrice = Number(homePrice);
        }
    }
}

export class OverUnderOdds {
    private overUnder: number | null;
    private overPrice: number | null;
    private underPrice: number | null;

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
        overUnder: number | string | null,
    }) {
        if (overUnder === null) {
            this.overUnder = null;
        } else {
            this.overUnder = Number(overUnder);
        }
    }

    public setOverPrice({
        overPrice,
    }: {
        overPrice: number | string | null,
    }) {
        if (overPrice === null) {
            this.overPrice = null;
        } else {
            this.overPrice = Number(overPrice);
        }
    }

    public setUnderPrice({
        underPrice,
    }: {
        underPrice: number | string | null,
    }) {
        if (underPrice === null) {
            this.underPrice = null;
        } else {
            this.underPrice = Number(underPrice);
        }
    }
}