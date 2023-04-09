import { Odd } from "./odd";
import { ContinuousOdd } from "./continuousOdd";
import { DiscreteOdd } from './discreteOdd';

import * as localModels from '../../../local';

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: localModels.Inequality,
        updateFunction: Function,
    }): Promise<ContinuousOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        value,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        value: string,
        updateFunction: Function,
    }): Promise<DiscreteOdd>;

    public async findOrCreate({
        exchange,
        statistic,
        inequality,
        value,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality?: localModels.Inequality,
        value?: string
        updateFunction: Function,
    }): Promise<ContinuousOdd | DiscreteOdd> {
        for (const odd of this) {
            if (odd.exchange === exchange && odd.statistic === statistic) {
                if (odd instanceof ContinuousOdd && inequality !== undefined) {
                    if (odd.inequality === inequality) {
                        return odd;
                    }
                } else if (odd instanceof DiscreteOdd && value !== undefined) {
                    if (odd.value === value) {
                        return odd;
                    }
                }
            }
        }

        if (inequality) {
            const newContinuousOdd = await ContinuousOdd.create({
                exchange: exchange,
                statistic: statistic,
                updateFunction: updateFunction,
            });
            
            newContinuousOdd.inequality = inequality;

            this.add(newContinuousOdd);
            
            return newContinuousOdd;
        } else if (value !== undefined) {
            const newDiscreteOdd = await DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                updateFunction: updateFunction,
            });
            
            newDiscreteOdd.value = value;
            
            this.add(newDiscreteOdd);
            
            return newDiscreteOdd;
        }

        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }
}