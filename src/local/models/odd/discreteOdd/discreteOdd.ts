import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Inequality, Odd } from '../odd';

export class DiscreteOdd extends Odd {
    // private properties
    protected wrappedValue: string | null;

    // private sequelize object
    private wrappedSqlDiscreteOdd: databaseModels.DiscreteOdd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        value,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateElementsFunction: Function,
    }) {
        super({
            exchange: exchange,
            statistic: statistic,
            inequality: Inequality.Equal,
            updateElementsFunction: updateElementsFunction,
        });

        this.wrappedValue = value;

        this.wrappedSqlDiscreteOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        value,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateElementsFunction: Function,
    }): Promise<DiscreteOdd> {
        const newDiscreteOdd = new DiscreteOdd({
            exchange: exchange,
            statistic: statistic,
            value: value,
            updateElementsFunction: updateElementsFunction,
        });

        await newDiscreteOdd.initSqlDiscreteOdd();

        globalModels.allOdds.add(newDiscreteOdd);

        return newDiscreteOdd;
    }

    // private sequelize instance constructor
    private async initSqlDiscreteOdd(): Promise<databaseModels.DiscreteOdd> {
        const exchange = this.exchange;
        const statistic = this.statistic;

        const exchangeId = exchange.sqlExchange.get('id');
        const statisticId = statistic.sqlStatistic.get('id');

        await databaseModels.DiscreteOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                value: await this.getValue(),
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: Inequality.Equal,
                value: await this.getValue(),
            }
        }).then(async ([sqlDiscreteOdd, created]) => {
            if (!created) {
                await sqlDiscreteOdd.update({

                });
            }

            this.sqlDiscreteOdd = sqlDiscreteOdd;
        });

        return this.sqlDiscreteOdd;
    }

    // getters and setters
    get sqlDiscreteOdd(): databaseModels.DiscreteOdd {
        if (!this.wrappedSqlDiscreteOdd) {
            throw new Error(`${this.exchange.name} ${this.statistic.name} sqlDiscreteOdd is null.`);
        }

        return this.wrappedSqlDiscreteOdd;
    }

    set sqlDiscreteOdd(sqlDiscreteOdd: databaseModels.DiscreteOdd) {
        this.wrappedSqlDiscreteOdd = sqlDiscreteOdd;
    }

    public async getInequality(): Promise<Inequality | null> {
        const inequality = this.inequality;
        return inequality;
    }

    public async setInequality(inequality: Inequality | null) {
        this.inequality = inequality;

        await this.sqlDiscreteOdd.update({
            inequality: inequality,
        });
    }

    public async getPrice(): Promise<number | null> {
        const price = this.price;
        return price;
    }

    public async setPrice(price: number | null) {
        this.price = price;

        await this.sqlDiscreteOdd.update({
            price: price,
        });
    }

    public async getValue(): Promise<string | null> {
        const value = this.wrappedValue;
        return value;
    }

    public async setValue(value: string | null) {
        this.wrappedValue = value;

        await this.sqlDiscreteOdd.update({
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