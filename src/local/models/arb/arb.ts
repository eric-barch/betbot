import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Arb {
    private oddPair: Set<localModels.Odd>;

    constructor({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }) {
        console.log('NEW ARB!');
        this.oddPair = new Set([oddA, oddB]);
        globalModels.allArbs.add(this);
    }

    public matches({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }): boolean {
        if (this.oddPair.size !== 2) {
            return false;
        }

        const oddAMatches = (this.oddPair.has(oddA));
        const oddBMatches = (this.oddPair.has(oddB));

        if (oddAMatches && oddBMatches) {
            return true;
        }

        return false;
    }
}