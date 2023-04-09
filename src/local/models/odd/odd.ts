import * as puppeteer from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class Odd {
    // public properties
    public price: number | null;

    // private properties
    private updateFunction: Function | null;

    // public linked objects
    public exchange: localModels.Exchange;
    public statistic: localModels.Statistic;
    
    // private sequelize object
    // children hold their own sequelize reference

    // private constructor
    public constructor({
        exchange,
        statistic,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateFunction: Function,
    }) {
        this.price = null;

        this.updateFunction = updateFunction;

        this.exchange = exchange;
        this.statistic = statistic;

        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }

    // public instance methods
    public matches({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        
        if (exchangeMatches && statisticMatches) {
            return true;
        }

        return false;
    }

    public async update() {
        if (!this.updateFunction) {
            throw new Error(`Update function is null.`);
        }

        await this.updateFunction();
    }

    // public static methods

    // getters and setters

}