import * as localModels from '../../../local';

import { Odd } from "./odd";
import { ContinuousOdd } from "./continuousOdd";
import { DiscreteOdd } from './discreteOdd';

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: localModels.Inequality,
        updateOddElementsFunction: Function,
    }): Promise<ContinuousOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        value,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateOddElementsFunction: Function,
    }): Promise<DiscreteOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        value,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality?: localModels.Inequality,
        value?: string
        updateOddElementsFunction: Function,
    }): Promise<ContinuousOdd | DiscreteOdd> {
        let requestedOdd = null;

        for (const odd of this) {
            if (odd instanceof ContinuousOdd) {
                if (odd.matches({
                    exchange: exchange,
                    statistic: statistic,
                    inequality: inequality!,
                })) {
                    return odd;
                }
            } else if (odd instanceof DiscreteOdd) {
                if (odd.matches({
                    exchange: exchange,
                    statistic: statistic,
                    value: value!,
                })) {
                    return odd;
                }
            }
        }

        if (inequality) {
            const newContinuousOdd = await ContinuousOdd.create({
                exchange: exchange,
                statistic: statistic,
                inequality: inequality,
                updateOddElementsFunction: updateOddElementsFunction,
            });

            this.add(newContinuousOdd);
            
            return newContinuousOdd;
        } else if (value) {
            const newDiscreteOdd = await DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                value: value,
                updateOddElementsFunction: updateOddElementsFunction,
            });
            
            this.add(newDiscreteOdd);
            
            return newDiscreteOdd;
        }

        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }

    public async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}