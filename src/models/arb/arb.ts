import columnify from 'columnify';

import * as globalModels from '../../global';
import * as localModels from '../../models';

export class Arb {
    private oddPair: Array<localModels.Odd>;
    
    private lastOddAPrice: number | null;
    private lastOddAValue: number | null;
    private lastOddBPrice: number | null;
    private lastOddBValue: number | null;

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

        this.lastOddAPrice = oddA.getPrice();
        this.lastOddAValue = oddA.getValue();
        this.lastOddBPrice = oddB.getPrice();
        this.lastOddBValue = oddB.getValue();

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

        let perfectMatch = true;

        if (!oddAPriceMatches) {
            perfectMatch = false;
            this.lastOddAPrice = oddAPrice;
        }

        if (!oddAValueMatches) {
            perfectMatch = false;
            this.lastOddAValue = oddAValue;
        }

        if (!oddBPriceMatches) {
            perfectMatch = false;
            this.lastOddBPrice = oddBPrice;
        }

        if (!oddBValueMatches) {
            perfectMatch = false;
            this.lastOddBValue = oddBValue;
        }

        if (!perfectMatch) {
            console.log('ARB UPDATED:');
            console.log(this.toString());
            this.testForDeletion();
        }
    }

    public testForDeletion() {
        const oddA = this.oddPair[0];
        const oddB = this.oddPair[1];

        const oddAValue = oddA.getValue();
        const oddBValue = oddB.getValue();
        let valuesMatch: boolean;
        
        if (oddAValue && oddBValue) {
            valuesMatch = (Math.abs(oddAValue) === Math.abs(oddBValue));
        } else {
            valuesMatch = (oddAValue === oddBValue);
        }

        const positiveReturn = (this.expectedReturn > 0);
        const nonNullPrices = (oddA.getPrice() && oddB.getPrice());

        if (!valuesMatch) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb values no longer match. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
            return;
        }

        if (!positiveReturn) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb no longer has positive return. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
            return;
        }

        if (!nonNullPrices) {
            const deletedAt = new Date();
            const duration = deletedAt.getTime() - this.createdAt.getTime();
            console.log(`Arb now has at least one null price. Lasted ${duration} ms. Deleting.\n`);
            globalModels.allArbs.delete(this);
        }
    }

    public toString(): string {
        const oddA = Array.from(this.oddPair)[0];
        const oddB = Array.from(this.oddPair)[1];

        const gameName = oddA.outcome.game.regionAbbrIdentifierAbbr;
        const expectedReturnString = `${this.expectedReturn.toFixed(2)}%`;

        const titleString = `${gameName}\t${expectedReturnString}`

        const oddAExchangeName = oddA.exchange.name;
        const oddAOutcomeName = oddA.outcome.name;
        const oddAPrice = oddA.getPrice();
        const oddAValue = oddA.getValue();

        const oddBExchangeName = oddB.exchange.name;
        const oddBOutcomeName = oddB.outcome.name;
        const oddBPrice = oddB.getPrice();
        const oddBValue = oddB.getValue();

        const data = [
            { exchange: oddAExchangeName, outcome: oddAOutcomeName, price: oddAPrice, value: oddAValue },
            { exchange: oddBExchangeName, outcome: oddBOutcomeName, price: oddBPrice, value: oddBValue },
        ]

        const dataString = columnify(data);

        const string = `${titleString}\n${dataString}\n`
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