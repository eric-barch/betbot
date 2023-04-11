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
        for (const odd of this) {
            if (odd.exchange === exchange && odd.statistic === statistic) {
                if (odd instanceof ContinuousOdd && inequality !== undefined) {
                    if (await odd.getInequality() === inequality) {
                        return odd;
                    }
                } else if (odd instanceof DiscreteOdd && value !== undefined) {
                    if (await odd.getValue() === value) {
                        return odd;
                    }
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
            
            newContinuousOdd.setInequality(inequality);

            this.add(newContinuousOdd);
            
            return newContinuousOdd;
        } else if (value !== undefined) {
            const newDiscreteOdd = await DiscreteOdd.create({
                exchange: exchange,
                statistic: statistic,
                value: value,
                updateElementsFunction: updateElementsFunction,
            });
            
            await newDiscreteOdd.setValue(value);
            
            this.add(newDiscreteOdd);
            
            return newDiscreteOdd;
        }

        throw new Error(`Invalid parameters provided. Either "inequality" or "value" must be defined.`);
    }
}