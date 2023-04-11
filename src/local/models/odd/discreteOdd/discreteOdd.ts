import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Inequality, Odd } from '../odd';

export class DiscreteOdd extends Odd {
    // private properties
    protected wrappedValue: string;

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
        const value = await this.getValue();

        await databaseModels.DiscreteOdd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                value: value,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: Inequality.Equal,
                value: value,
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

    // public instance methods
    public matches({
        exchange,
        statistic,
        value,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        const valueMatches = (this.wrappedValue === value);

        if (exchangeMatches && statisticMatches && valueMatches) {
            return true;
        }

        return false;
    }

    public async updateValues(): Promise<void> {
        const priceElement = await this.getPriceElement();

        if (!priceElement) {
            await this.setPrice(null);
        } else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

            if (!priceJson) {
                await this.setPrice(null);
                return;
            }
    
            const price = Number(priceJson.replace(/[^0-9+\-.]/g, ''));

            await this.setPrice(price);
        }
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

    public async setInequality(inequality: Inequality) {
        this.wrappedInequality = inequality;

        await this.sqlDiscreteOdd.update({
            inequality: inequality,
        });
    }

    public async setPrice(price: number | null) {
        this.wrappedPrice = price;

        await this.sqlDiscreteOdd.update({
            price: price,
        });
    }

    public getValue(): string | null {
        return this.wrappedValue;
    }

    public async setValue(value: string) {
        this.wrappedValue = value;

        await this.sqlDiscreteOdd.update({
            value: value,
        })
    }
}