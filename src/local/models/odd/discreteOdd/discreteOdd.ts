import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Inequality, Odd } from '../odd';

export class DiscreteOdd extends Odd {
    // public properties

    // private properties
    private wrappedValue: string;

    // public linked objects

    // private linked objects

    // private sequelize object
    private wrappedSqlDiscreteOdd: databaseModels.DiscreteOdd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        value,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateFunction: Function,
    }) {
        super({
            exchange: exchange,
            statistic: statistic,
            inequality: Inequality.Equal,
            updateFunction: updateFunction,
        });

        this.wrappedValue = value;

        this.wrappedSqlDiscreteOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        value,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateFunction: Function,
    }): Promise<DiscreteOdd> {
        const newDiscreteOdd = new DiscreteOdd({
            exchange: exchange,
            statistic: statistic,
            value: value,
            updateFunction: updateFunction,
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
                value: this.value,
            },
            defaults: {
                exchangeId: exchangeId,
                statisticId: statisticId,
                inequality: Inequality.Equal,
                value: this.value,
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

    // public static methods

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

    get price(): number | null {
        return this.wrappedPrice;
    }

    public async setPrice(price: number | null) {
        this.wrappedPrice = price;

        await this.sqlDiscreteOdd.update({
            price: price,
        });
    }

    get value(): string {
        return this.wrappedValue;
    }

    public async setValue(value: string) {
        this.wrappedValue = value;

        await this.sqlDiscreteOdd.update({
            value: value,
        });
    }
}