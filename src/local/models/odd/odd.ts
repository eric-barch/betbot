import * as puppeteer from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export enum Inequality {
    GreaterThan,
    EqualTo,
    LessThan,
}

export class Odd {
    // public properties

    // private properties
    private wrappedInequality: Inequality | null;
    private wrappedPrice: number | null;
    private wrappedValue: number | string | null;

    // public linked objects
    public exchange: localModels.Exchange;
    public statistic: localModels.Statistic;

    // private linked objects
    private wrappedElement: puppeteer.ElementHandle | null;
    private wrappedOpposite: Odd | null;
    
    // private sequelize object
    public wrappedSqlOdd: databaseModels.Odd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }) {
        this.wrappedInequality = null;
        this.wrappedPrice = null;
        this.wrappedValue = null;

        this.exchange = exchange;
        this.statistic = statistic;

        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);

        this.wrappedElement = null;
        this.wrappedOpposite = null;

        this.wrappedSqlOdd = null;
    }

    // public async constructor
    public static async create({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }): Promise<Odd> {
        const newOdd = new Odd({
            exchange: exchange,
            statistic: statistic,
        });

        await newOdd.initSqlOdd();

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    // private sequelize instance constructor
    private async initSqlOdd(): Promise<databaseModels.Odd> {
        const exchange = this.exchange;
        const statistic = this.statistic;

        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');

        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                // Transfer current odd to PastOdds.
                await sqlOdd.update({

                });
            }
            
            this.sqlOdd = sqlOdd;
        });

        return this.sqlOdd;
    }

    // public instance methods
    public matches({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);

        if (exchangeMatches && statisticMatches) {
            return true;
        }

        return false;
    }


    // public static methods

    // getters and setters
    get element(): puppeteer.ElementHandle {
        if (!this.wrappedElement) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} element is null.`);
        }

        return this.wrappedElement;
    }

    set element(element: puppeteer.ElementHandle) {
        this.wrappedElement = element;
    }

    get opposite(): Odd {
        if (!this.wrappedOpposite) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} opposite is null.`);
        }

        return this.wrappedOpposite;
    }

    set opposite(opposite: Odd) {
        this.opposite = opposite;
        opposite.opposite = this;
    }

    get sqlOdd(): databaseModels.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}