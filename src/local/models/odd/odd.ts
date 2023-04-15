import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Odd {
    // private properties
    private wrappedPrice: number | null;
    private wrappedValue: number | null;
    private updateOddElementsFunction: Function;

    // public linked objects
    public exchange: localModels.Exchange;
    public statistic: localModels.Statistic;

    // private linked objects
    private wrappedPriceElement: ElementHandle | null;
    private wrappedValueElement: ElementHandle | null;

    // private sequelize object
    private wrappedSqlOdd: databaseModels.Odd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateOddElementsFunction: Function,
    }) {
        this.wrappedPrice = null;
        this.wrappedValue = null;

        this.updateOddElementsFunction = updateOddElementsFunction.bind(this);

        this.exchange = exchange;
        this.statistic = statistic;

        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;

        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);

        this.wrappedSqlOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateOddElementsFunction: Function,
    }): Promise<Odd> {
        const newOdd = new Odd({
            exchange: exchange,
            statistic: statistic,
            updateOddElementsFunction: updateOddElementsFunction,
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
        const value = this.getValue();

        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                value: value,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
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
    };

    public async updateElements() {
        await this.updateOddElementsFunction({
            exchange: this.exchange,
            statistic: this.statistic,
        });
    }

    public async updateValues(): Promise<void> {
        const priceElement = await this.getPriceElement();
        const valueElement = await this.getValueElement();

        if (!priceElement) {
            await this.setPrice(null);
        } else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

            if (!priceJson) {
                await this.setPrice(null);
            } else {
                const priceJsonClean = priceJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
                const price = Number(priceJsonClean);
                await this.setPrice(price);
            }
        }

        if (!valueElement) {
            await this.setValue(null);
            return;
        }

        const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();

        if (!valueJson) {
            this.setValue(null);
            return;
        }
    
        const valueJsonClean = valueJson.replace(/[a-zA-Z\s]/g, '').replace(/−/g, '-');
        const value = Number(valueJsonClean);
        await this.setValue(value);
    }

    // getters and setters
    public async getPriceElement(): Promise<ElementHandle | null> {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }

        return this.wrappedPriceElement;
    }

    public setPriceElement(priceElement: ElementHandle | null) {
        this.wrappedPriceElement = priceElement;
    }

    public async getValueElement(): Promise<ElementHandle | null> {
        if(!this.wrappedValueElement) {
            await this.updateElements();
        }

        return this.wrappedValueElement;
    }

    public setValueElement(valueElement: ElementHandle | null) {
        this.wrappedValueElement = valueElement;
    }

    public getPrice(): number | null {
        return this.wrappedPrice;
    }

    public async setPrice(price: number | null) {
        this.wrappedPrice = price;

        await this.sqlOdd.update({
            price: price,
        });
    }

    public getValue(): number | null {
        return this.wrappedValue;
    }

    public async setValue(value: number | null) {
        this.wrappedValue = value;

        await this.sqlOdd.update({
            value: value,
        })
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