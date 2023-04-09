import * as databaseModels from '../../../../database';
import * as globalModels from '../../../../global';
import * as localModels from '../../..';

export class DiscreteOdd extends localModels.Odd {
    // public properties
    public value: string | null;

    // private properties

    // public linked objects

    // private sequelize object
    private wrappedSqlDiscreteOdd: databaseModels.DiscreteOdd | null;

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

        this.value = null;

        this.wrappedSqlDiscreteOdd = null;
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
    }): Promise<DiscreteOdd> {
        const newDiscreteOdd = new DiscreteOdd({
            exchange: exchange,
            statistic: statistic,
            updateFunction: updateFunction,
        });

        await newDiscreteOdd.initSqlDiscreteOdd();

        globalModels.allDiscreteOdds.add(newDiscreteOdd);

        return newDiscreteOdd;
    }

    // private sequelize instance constructor
    private async initSqlDiscreteOdd(): Promise<databaseModels.DiscreteOdd> {
        
    }
}