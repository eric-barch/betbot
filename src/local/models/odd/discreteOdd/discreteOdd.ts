import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Odd } from '../odd';

export class DiscreteOdd extends Odd {
    // public properties
    public value: string;

    // private properties

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
            updateFunction: updateFunction,
        });

        this.value = value;

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
}