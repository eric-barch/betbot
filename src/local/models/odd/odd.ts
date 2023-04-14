import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../local';

export enum Inequality {
    Over = 'over',
    Equal = 'equal',
    Under = 'under',
}

export abstract class Odd {
    // private properties
    protected wrappedInequality: Inequality;
    protected wrappedPrice: number | null;
    protected abstract wrappedValue: number | string | null;
    protected updateOddElementsFunction: Function;

    // public linked objects
    public exchange: localModels.Exchange;
    public statistic: localModels.Statistic;

    // private linked objects
    private wrappedPriceElement: ElementHandle | null;
    private wrappedValueElement: ElementHandle | null;

    // private constructor
    protected constructor({
        exchange,
        statistic,
        inequality,
        updateOddElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateOddElementsFunction: Function,
    }) {
        this.wrappedInequality = inequality;
        this.wrappedPrice = null;

        this.updateOddElementsFunction = updateOddElementsFunction.bind(this);

        this.exchange = exchange;
        this.statistic = statistic;

        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;

        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }

    // public instance methods
    abstract matches({
        exchange,
        statistic,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
    }): boolean;

    protected async updateElements() {
        await this.updateOddElementsFunction({
            exchange: this.exchange,
            statistic: this.statistic,
        });
    }

    abstract updateValues(): Promise<void>;

    // getters and setters
    public async getPriceElement(): Promise<ElementHandle | null> {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }

        return this.wrappedPriceElement;
    }

    public setPriceElement(priceElement: ElementHandle | null) {
        this.wrappedPriceElement = priceElement;
    }

    public async getValueElement(): Promise<ElementHandle | null> {
        if(!this.wrappedValueElement) {
            await this.updateElements();
        }

        return this.wrappedValueElement;
    }

    public setValueElement(valueElement: ElementHandle | null) {
        this.wrappedValueElement = valueElement;
    }

    public getInequality(): Inequality {
        return this.wrappedInequality;
    }

    abstract setInequality(inequality: Inequality): Promise<void>;

    public getPrice(): number | null {
        return this.wrappedPrice;
    }

    abstract setPrice(price: number | null): Promise<void>;

    abstract getValue(): string | number | null;

    abstract setValue(value: string | number | null): Promise<void>;
}