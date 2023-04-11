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
        const inequality = this.getInequality();
        const value = this.getValue();

        await databaseModels.ContinuousOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: inequality,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: inequality,
                value: value,
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

    // public instance methods
    public matches({
        exchange,
        statistic,
        inequality,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        const inequalityMatches = (this.wrappedInequality === inequality);

        if (exchangeMatches && statisticMatches && inequalityMatches) {
            return true;
        }

        return false;
    }

    // this function is slow
    public async updateValues(): Promise<void> {
        const start = new Date();
        const priceElement = await this.getPriceElement();
        const valueElement = await this.getValueElement();

        if (!priceElement) {
            await this.setPrice(null);
            const priceEnd = new Date();

            const priceDuration = (priceEnd.getTime() - start.getTime());
            console.log(`priceDuration: ${priceDuration}`); // 15 32 28
        } else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

            if (!priceJson) {
                await this.setPrice(null);
                const priceEnd = new Date();

                const priceDuration = (priceEnd.getTime() - start.getTime());
                console.log(`priceDuration: ${priceDuration}`);
                return;
            }
    
            const price = Number(priceJson.replace(/[^0-9+\-.]/g, ''));

            await this.setPrice(price);
            const priceEnd = new Date();

            const priceDuration = (priceEnd.getTime() - start.getTime());
            console.log(`priceDuration: ${priceDuration}`); // 39 24 14 17 24
        }

        if (!valueElement) {
            this.setValue(null);
            return;
        } else {
            const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();

            if (!valueJson) {
                this.setValue(null);
                return;
            }
    
            const value = Number(valueJson.replace(/[^0-9+\-.]/g, ''));
    
            this.setValue(value);
        }
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

    public async setInequality(inequality: Inequality) {
        this.wrappedInequality = inequality;

        await this.sqlContinuousOdd.update({
            inequality: inequality,
        });
    }

    public async setPrice(price: number | null) {
        this.wrappedPrice = price;

        await this.sqlContinuousOdd.update({
            price: price,
        });
    }

    public getValue(): number | null {
        return this.wrappedValue;
    }

    public async setValue(value: number | null) {
        this.wrappedValue = value;

        await this.sqlContinuousOdd.update({
            value: value,
        })
    }
}