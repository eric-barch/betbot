import * as globalModels from '../../global';
import * as localModels from '../../models';

export class Arb {
    private oddPair: Set<localModels.Odd>;

    constructor({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }) {
        const oddAExchangeName = oddA.getExchange().name;
        const oddAGameName = oddA.getOutcome().game.regionAbbrIdentifierAbbr;
        const oddAOutcomeName = oddA.getOutcome().name;
        const oddAPrice = oddA.getPrice();
        const oddAValue = oddA.getValue();

        const oddBExchangeName = oddB.getExchange().name;
        const oddBGameName = oddB.getOutcome().game.regionAbbrIdentifierAbbr;
        const oddBOutcomeName = oddB.getOutcome().name;
        const oddBPrice = oddB.getPrice();
        const oddBValue = oddB.getValue();

        console.log('ARB:');
        console.log(`${oddAExchangeName} ${oddAGameName} ${oddAOutcomeName} ${oddAPrice} ${oddAValue}`);
        console.log(`${oddBExchangeName} ${oddBGameName} ${oddBOutcomeName} ${oddBPrice} ${oddBValue}\n`);

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