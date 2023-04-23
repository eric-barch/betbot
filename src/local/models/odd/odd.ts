import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class Odd {
    abstract priceElementXPath: string;
    abstract valueElementXPath: string | null;

    public priceElement: ElementHandle | null;
    public valueElement: ElementHandle | null;

    private wrappedPrice: number | null;
    private wrappedValue: number | null;

    private wrappedExchange: localModels.Exchange | null;
    private wrappedOutcome: localModels.Outcome | null;

    private wrappedSqlOdd: databaseModels.Odd | null;

    constructor() {
        this.priceElement = null;
        this.valueElement = null;

        this.wrappedPrice = null;
        this.wrappedValue = null;

        this.wrappedExchange = null;
        this.wrappedOutcome = null;

        this.wrappedSqlOdd = null;

        globalModels.allOdds.add(this);
    }

    public async initSqlOdd(): Promise<databaseModels.Odd> {
        const exchangeId = this.getExchange().sqlExchange.get('id');
        const outcomeId = this.getOutcome().sqlOutcome.get('id');
        const value = this.getValue();

        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                outcomeId: outcomeId,
            },
            defaults: {
                exchangeId: exchangeId,
                outcomeId: outcomeId,
                value: value,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                await sqlOdd.update({

                });
            }

            this.sqlOdd = sqlOdd;
        });

        return this.sqlOdd;
    }

    public matches({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }): boolean {
        const exchangeMatches = (this.getExchange() === exchange);
        const outcomeMatches = (this.getOutcome() === outcome);

        if (exchangeMatches && outcomeMatches) {
            return true;
        }

        return false;
    }

    public async updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }> {
        const priceElement = await this.updatePriceElement();
        const valueElement = await this.updateValueElement();

        return {
            priceElement: priceElement,
            valueElement: valueElement,
        }
    }

    public async updateValues(): Promise<{
        priceValue: number | null,
        valueValue: number | null,
    }> {
        const priceValue = await this.updatePriceValue();
        const valueValue = await this.updateValueValue();

        return {
            priceValue: priceValue,
            valueValue: valueValue,
        }
    }

    public async updatePriceElement(): Promise<ElementHandle | null> {
        const priceElement = await this.updateElement(this.priceElementXPath);
        this.priceElement = priceElement;
        return priceElement;
    }

    public async updateValueElement(): Promise<ElementHandle | null> {
        const valueElement = await this.updateElement(this.valueElementXPath);
        this.valueElement = valueElement;
        return valueElement;
    }

    public async updatePriceValue(): Promise<number | null> {
        const priceElement = this.priceElement;
        const priceValue = await this.updateValue(priceElement);
        await this.setPrice(priceValue);
        return priceValue;
    }

    public async updateValueValue(): Promise<number | null> {
        const valueElement = this.valueElement;
        const valueValue = await this.updateValue(valueElement);
        await this.setValue(valueValue);
        return valueValue;
    }

    abstract updateElement(xPath: string | null): Promise<ElementHandle | null>;

    public async updateValue(element: ElementHandle | null): Promise<number | null> {
        if (!element) {
            return null;
        }

        const json = await (await element.getProperty('textContent')).jsonValue();

        if (!json) {
            return null;
        }

        const hyphenVariations = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g;
        const nonNumericChars = /[^0-9.-]/g;

        const cleanedJson = json
            .replace(hyphenVariations, '-')
            .replace(nonNumericChars, '');
        
        const value = Number(cleanedJson);
        return value;
    }

    public getPrice(): number | null {
        return this.wrappedPrice;
    }

    public async setPrice(price: number | null) {
        this.wrappedPrice = price;

        await this.sqlOdd.update({
            price: price,
        });
    }

    public getValue(): number | null {
        return this.wrappedValue;
    }

    public async setValue(value: number | null) {
        this.wrappedValue = value;

        await this.sqlOdd.update({
            value: value,
        })
    }

    public getExchange(): localModels.Exchange {
        if (!this.wrappedExchange) {
            throw new Error(`Exchange is null.`);
        }

        return this.wrappedExchange;
    }

    public setExchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
        exchange.getOdds().add(this);
    }

    public getOutcome(): localModels.Outcome {
        if (!this.wrappedOutcome) {
            throw new Error(`Outcome is null.`);
        }

        return this.wrappedOutcome;
    }

    public setOutcome(outcome: localModels.Outcome) {
        this.wrappedOutcome = outcome;
        outcome.odds.add(this);
    }

    get sqlOdd(): databaseModels.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}