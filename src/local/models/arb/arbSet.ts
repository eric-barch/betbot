import * as localModels from '../../../local';

import { Arb } from './arb';

export class ArbSet extends Set<Arb> {
    public find({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }): Arb | null {
        for (const arb of this) {
            if (arb.matches({
                oddA: oddA,
                oddB: oddB,
            })) {
                return arb;
            }
        }

        return null;
    }

    public async findOrCreate({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }) {
        const foundArb = this.find({
            oddA: oddA,
            oddB: oddB,
        })

        if (foundArb) {
            return foundArb;
        }

        const newArb = new Arb({
            oddA: oddA,
            oddB: oddB,
        });

        this.add(newArb);
        return newArb;
    }
}