import * as localModels from '../../../local';

import { Odd } from "./odd";

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
        updateElementsFunction,
        updateValuesFunction,

    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateElementsFunction: Function,
        updateValuesFunction: Function,
    }): Promise<Odd> {
        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                statistic: statistic,
            })) {
                return odd;
            }
            
        }

        const newOdd = await Odd.create({
            exchange: exchange,
            statistic: statistic,
            updateElementsFunction: updateElementsFunction,
            updateValuesFunction: updateValuesFunction,
        });
        
        this.add(newOdd);
        
        return newOdd;
    }

    public async updateElements() {
        await Promise.all(Array.from(this).map(odd => odd.updateElements()));
    }

    public async updateValues() {
        await Promise.all(Array.from(this).map(odd => odd.updateValues()));
    }
}