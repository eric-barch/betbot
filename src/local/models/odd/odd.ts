import * as puppeteer from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class Odd {
    // public properties
    public price: number | null;

    // private properties
    private updateFunction: Function;

    // public linked objects
    public exchange: localModels.Exchange;
    
    // private sequelize object
    // children hold their own sequelize reference

    // private constructor
    public constructor({
        exchange,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        updateFunction: Function,
    }) {
        this.price = null;

        this.updateFunction = updateFunction;

        this.exchange = exchange;

        this.exchange.oddSet.add(this);
    }

    // public async constructor
    // cannot instantiate abstract class

    // private sequelize instance constructor
    // children hold their own sequelize reference

    // public instance methods
    public async update() {
        await this.updateFunction;
    }

    // public static methods

    // getters and setters

}