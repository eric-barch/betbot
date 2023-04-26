import * as globalModels from '../../global';
import * as localModels from '../../models';

export class Arb {
    private oddPair: Array<localModels.Odd>;
    
    private lastOddAValue: number | null;
    private lastOddAPrice: number | null;
    private lastOddBValue: number | null;
    private lastOddBPrice: number | null;

    private createdAt: Date;

    constructor({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }) {
        this.createdAt = new Date();
        
        this.oddPair = [oddA, oddB];

        this.lastOddAValue = oddA.getValue();
        this.lastOddAPrice = oddA.getPrice();
        this.lastOddBValue = oddB.getValue();
        this.lastOddBPrice = oddB.getPrice();

        console.log('NEW ARB:');
        console.log(this.toString());
        
        globalModels.allArbs.add(this);
    }

    public matches({
        oddA,
        oddB,
    }: {
        oddA: localModels.Odd,
        oddB: localModels.Odd,
    }): boolean {
        if (this.oddPair.length !== 2) {
            return false;
        }

        const oddAMatches = (this.oddPair.includes(oddA));
        const oddBMatches = (this.oddPair.includes(oddB));

        if (oddAMatches && oddBMatches) {
            return true;
        }

        return false;
    }

    public async update() {
        const oddA = this.oddPair[0];
        const oddB = this.oddPair[1];

        const oddAPrice = oddA.getPrice();
        const oddAValue = oddA.getValue();
        const oddBPrice = oddB.getPrice();
        const oddBValue = oddB.getValue();

        const oddAPriceMatches = (this.lastOddAPrice === oddAPrice);
        const oddAValueMatches = (this.lastOddAValue === oddAValue);
        const oddBPriceMatches = (this.lastOddBPrice === oddBPrice);
        const oddBValueMatches = (this.lastOddBValue === oddBValue);

        if (!oddAPriceMatches ||
            !oddAValueMatches ||
            !oddBPriceMatches ||
            !oddBValueMatches) {
                console.log('ARB UPDATED:');
                console.log(this.toString());
                this.testForDeletion();
        }
    }

    public testForDeletion() {
        const oddA = this.oddPair[0];
        const oddB = this.oddPair[1];

        const valuesMatch = (oddA.getValue() === oddB.getValue());
        const positiveReturn = (this.expectedReturn > 0);
        const nonNullPricesAndValues = (oddA.getPrice() && oddA.getValue() && oddB.getPrice() && oddB.getValue());

        if (!valuesMatch) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb values no longer match. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
        }

        if (!positiveReturn) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb no longer has positive return. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
        }

        if (!nonNullPricesAndValues) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb now has at least one positive price or value. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
        }
    }

    public toString(): string {
        const oddA = Array.from(this.oddPair)[0];
        const oddB = Array.from(this.oddPair)[1];

        const gameName = oddA.getOutcome().game.regionAbbrIdentifierAbbr;
        const expectedReturn = this.expectedReturn;

        const gameString = `${gameName}\t${expectedReturn}`

        const oddAExchangeName = oddA.getExchange().name;
        const oddAOutcomeName = oddA.getOutcome().name;
        const oddAPrice = oddA.getPrice();
        const oddAValue = oddA.getValue();

        const oddAString = `${oddAExchangeName}\t${oddAOutcomeName}\t${oddAPrice}\t${oddAValue}`;

        const oddBExchangeName = oddB.getExchange().name;
        const oddBOutcomeName = oddB.getOutcome().name;
        const oddBPrice = oddB.getPrice();
        const oddBValue = oddB.getValue();

        const oddBString = `${oddBExchangeName}\t${oddBOutcomeName}\t${oddBPrice}\t${oddBValue}`;

        const string = `${gameString}\n${oddAString}\n${oddBString}\n`
        return string;
    }

    get expectedReturn(): number {
        const odds = Array.from(this.oddPair);

        const oddAImpliedProbability = odds[0].impliedProbability;
        const oddBImpliedProbability = odds[1].impliedProbability;

        if (!oddAImpliedProbability || !oddBImpliedProbability) {
            return -1000;
        }

        const totalImpliedProbability = oddAImpliedProbability + oddBImpliedProbability;

        const expectedReturn = (1 - totalImpliedProbability) * 100;

        return expectedReturn;
    }
}