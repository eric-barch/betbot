import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Inequality, Odd } from '../odd';

export class ContinuousOdd extends Odd {
    // private properties
    protected wrappedValue: number | null;

    // private sequelize object
    private wrappedSqlContinuousOdd: databaseModels.ContinuousOdd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        inequality,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateElementsFunction: Function,
    }) {
        super({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateElementsFunction: updateElementsFunction,
        });

        this.wrappedValue = null;

        this.wrappedSqlContinuousOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        inequality,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateElementsFunction: Function,
    }): Promise<ContinuousOdd> {
        const newContinuousOdd = new ContinuousOdd({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateElementsFunction: updateElementsFunction,
        });

        await newContinuousOdd.initSqlContinuousOdd();

        globalModels.allOdds.add(newContinuousOdd);

        return newContinuousOdd;
    }

    // private sequelize instance constructor
    private async initSqlContinuousOdd(): Promise<databaseModels.ContinuousOdd> {
        const exchange = this.exchange;
        const statistic = this.statistic;

        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');

        await databaseModels.ContinuousOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: await this.getInequality(),
            },
        }).then(async ([sqlContinuousOdd, created]) => {
            if (!created) {
                await sqlContinuousOdd.update({

                });
            }

            this.sqlContinuousOdd = sqlContinuousOdd;
        });

        return this.sqlContinuousOdd;
    }

    // getters and setters
    get sqlContinuousOdd(): databaseModels.ContinuousOdd {
        if (!this.wrappedSqlContinuousOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlContinuousOdd is null.`);
        }

        return this.wrappedSqlContinuousOdd;
    }

    set sqlContinuousOdd(sqlContinuousOdd: databaseModels.ContinuousOdd) {
        this.wrappedSqlContinuousOdd = sqlContinuousOdd;
    }

    public async getInequality(): Promise<Inequality | null> {
        const inequality = this.inequality;
        return inequality;
    }

    public async setInequality(inequality: Inequality | null) {
        this.inequality = inequality;

        await this.sqlContinuousOdd.update({
            inequality: inequality,
        });
    }

    public async getPrice(): Promise<number | null> {
        const price = this.price;
        return price;
    }

    public async setPrice(price: number | null) {
        this.price = price;

        await this.sqlContinuousOdd.update({
            price: price,
        });
    }

    public async getValue(): Promise<number | null> {
        const value = this.wrappedValue;
        return value;
    }

    public async setValue(value: number | null) {
        this.wrappedValue = value;

        await this.sqlContinuousOdd.update({
            value: value,
        })
    }

    public async getPriceElement(): Promise<ElementHandle | null> {
        const element = await this.getWrappedPriceElement();
        return element;
    }

    public async setPriceElement(element: ElementHandle | null) {
        this.setWrappedPriceElement(element);
    }

    public async getValueElement(): Promise<ElementHandle | null> {
        const element = await this.getWrappedValueElement();
        return element;
    }

    public async setValueElement(element: ElementHandle | null) {
        this.setWrappedValueElement(element);
    }
}