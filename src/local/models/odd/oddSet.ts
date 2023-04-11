import * as localModels from '../../../local';

import { Odd } from "./odd";
import { ContinuousOdd } from "./continuousOdd";
import { DiscreteOdd } from './discreteOdd';

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: localModels.Inequality,
        updateElementsFunction: Function,
    }): Promise<ContinuousOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        value,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateElementsFunction: Function,
    }): Promise<DiscreteOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        value,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality?: localModels.Inequality,
        value?: string
        updateElementsFunction: Function,
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
                updateElementsFunction: updateElementsFunction,
            });

            this.add(newContinuousOdd);
            
            return newContinuousOdd;
        } else if (value) {
            const newDiscreteOdd = await DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                value: value,
                updateElementsFunction: updateElementsFunction,
            });
            
            this.add(newDiscreteOdd);
            
            return newDiscreteOdd;
        }

        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }
}