import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class Odd {
    abstract priceElementXPath: string;
    abstract valueElementXPath: string;

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
        const exchangeId = this.exchange.sqlExchange.get('id');
        const outcomeId = this.outcome.sqlOutcome.get('id');
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
        const exchangeMatches = (this.exchange === exchange);
        const outcomeMatches = (this.outcome === outcome);

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

    abstract updateElement(xPath: string): Promise<ElementHandle | null>;

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

    get exchange(): localModels.Exchange {
        if (!this.wrappedExchange) {
            throw new Error(`${this.exchange.name} exchange is null.`);
        }

        return this.wrappedExchange;
    }

    set exchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
    }

    get outcome(): localModels.Outcome {
        if (!this.wrappedOutcome) {
            throw new Error(`${this.outcome.name} outcome is null.`);
        }

        return this.wrappedOutcome;
    }

    set outcome(outcome: localModels.Outcome) {
        this.wrappedOutcome = outcome;
    }

    get sqlOdd(): databaseModels.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`${this.exchange.name} ${this.outcome.name} sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}