import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../local';

export enum Inequality {
    Over = 'over',
    Equal = 'equal',
    Under = 'under',
}

export abstract class Odd {
    // public properties
    public inequality: Inequality | null;
    public price: number | null;

    // private properties
    protected abstract wrappedValue: number | string | null;
    private updateElementsFunction: Function;

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
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        statistic: localModels.Statistic,
        inequality: Inequality,
        updateElementsFunction: Function,
    }) {
        this.inequality = inequality;
        this.price = null;

        this.updateElementsFunction = updateElementsFunction.bind(this);

        this.exchange = exchange;
        this.statistic = statistic;

        this.wrappedPriceElement = null;
        this.wrappedValueElement = null;

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

    protected async updateElements() {
        await this.updateElementsFunction();
    }

    public async updateValues() {
        const priceElement = await this.getWrappedPriceElement();
        const valueElement = await this.getWrappedValueElement();

        if (!priceElement) {
            this.price = null;
        } else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

            if (!priceJson) {
                this.price = null;
                return;
            }
    
            this.price = Number(priceJson.replace(/[^0-9+\-.]/g, ''));
        }

        if (!valueElement) {
            this.wrappedValue = null;
            return;
        }

        const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();

        if (!valueJson) {
            this.wrappedValue = null;
            return;
        }

        // this needs to be updated to account for strings
        this.wrappedValue = Number(valueJson.replace(/[^0-9+\-.]/g, ''));
    }

    // public static methods

    // getters and setters
    protected async getWrappedPriceElement(): Promise<ElementHandle | null> {
        if (!this.wrappedPriceElement) {
            await this.updateElements();
        }

        return this.wrappedPriceElement;
    }

    protected async setWrappedPriceElement(element: ElementHandle | null) {
        this.wrappedPriceElement = element;
    }

    protected async getWrappedValueElement(): Promise<ElementHandle | null> {
        if (!this.wrappedValueElement) {
            await this.updateElements();
        }

        return this.wrappedValueElement;
    }

    protected async setWrappedValueElement(element: ElementHandle | null) {
        this.wrappedValueElement = element;
    }
}