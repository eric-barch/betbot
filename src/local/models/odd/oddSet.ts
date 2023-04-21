import * as localModels from '../../../local';

import { Odd } from "./oddOld";

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        outcome,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
        updateElementsFunction: Function,
    }): Promise<Odd> {
        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                outcome: outcome,
            })) {
                return odd;
            }
            
        }

        const newOdd = await Odd.create({
            exchange: exchange,
            outcome: outcome,
            updateElementsFunction: updateElementsFunction,
        });
        
        this.add(newOdd);
        
        return newOdd;
    }

    public async checkForArbitrage() {
        for (const odd of this) {
            await odd.checkForArbitrage();
        }
    }

    public async updateElements() {
        for (const odd of this) {
            await odd.updateElements();
        }

        return this;
    }

    public async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}