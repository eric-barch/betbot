import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

export enum Inequality {
    GreaterThan = 'GREATER_THAN',
    EqualTo = 'EQUAL_TO',
    LessThan = 'LESS_THAN',
}

export class ContinuousOdd extends localModels.Odd {
    // public properties
    public inequality: Inequality | null;
    public value: number | null;

    // private properties

    // public linked objects

    // private sequelize object
    private wrappedSqlContinuousOdd: databaseModels.ContinuousOdd | null;

    // private constructor
    private constructor({
        exchange,
        statistic,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateFunction: Function,
    }) {
        super({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });

        this.inequality = null;
        this.value = null;

        this.wrappedSqlContinuousOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        statistic,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateFunction: Function,
    }): Promise<ContinuousOdd> {
        const newContinuousOdd = new ContinuousOdd({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });

        await newContinuousOdd.initSqlContinuousOdd();

        globalModels.allContinuousOdds.add(newContinuousOdd);

        return newContinuousOdd;
    }

    // private sequelize instance constructor
    private async initSqlContinuousOdd(): Promise<databaseModels.ContinuousOdd> {

    }
}