import * as localModels from '../../../local';

export enum Inequality {
    Over = 'over',
    Equal = 'equal',
    Under = 'under',
}

export abstract class Odd {
    // public properties
    public inequality: Inequality;

    // private properties
    protected wrappedPrice: number | null;
    private updateFunction: Function | null;

    // public linked objects
    public exchange: localModels.Exchange;
    public statistic: localModels.Statistic;

    // private constructor
    protected constructor({
        exchange,
        statistic,
        inequality,
        updateFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateFunction: Function,
    }) {
        this.inequality = inequality;

        this.wrappedPrice = null;

        this.updateFunction = updateFunction;

        this.exchange = exchange;
        this.statistic = statistic;

        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }

    // public instance methods
    public matches({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        
        if (exchangeMatches && statisticMatches) {
            return true;
        }

        return false;
    }

    public async update() {
        if (!this.updateFunction) {
            throw new Error(`Update function is null.`);
        }

        await this.updateFunction();
    }

    // public static methods

    // getters and setters
}