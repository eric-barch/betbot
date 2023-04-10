import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Odd } from '../odd';

export enum Inequality {
    Over = 'OVER',
    EqualTo = 'EQUAL',
    LessThan = 'UNDER',
}

export class ContinuousOdd extends Odd {
    // public properties
    public inequality: Inequality;
    public value: number | null;

    // private properties

    // public linked objects

    // private linked objects

    // private sequelize object
    private wrappedSqlContinuousOdd: databaseModels.ContinuousOdd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        inequality,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateFunction: Function,
    }) {
        super({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });

        this.inequality = inequality;
        this.value = null;

        this.wrappedSqlContinuousOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        inequality,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateFunction: Function,
    }): Promise<ContinuousOdd> {
        const newContinuousOdd = new ContinuousOdd({
            exchange: exchange,
            statistic: statistic,
            inequality: inequality,
            updateFunction: updateFunction,
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
                inequality: this.inequality.toString(),
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
}