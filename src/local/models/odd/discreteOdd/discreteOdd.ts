import * as globalModels from '../../../../global';
import * as localModels from '../../../../local';

import { Odd } from '../odd';

export class DiscreteOdd extends Odd {
    // public properties
    public value: string | null;

    // private properties

    // public linked objects

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

        globalModels.allOdds.add(newDiscreteOdd);

        return newDiscreteOdd;
    }
}