import * as localModels from '../../../local';

import { Odd } from "./odd";

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        statistic,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        updateOddElementsFunction: Function,
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
            updateOddElementsFunction: updateOddElementsFunction,
        });
        
        this.add(newOdd);
        
        return newOdd;
    }

    public async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}