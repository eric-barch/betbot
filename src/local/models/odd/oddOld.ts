import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../..';

export class Odd {
    // private properties
    private wrappedPrice: number | null;
    private wrappedValue: number | null;
    private wrappedUpdateElementsFunction: Function;

    // public linked objects
    public exchange: localModels.Exchange;
    public outcome: localModels.Outcome;
    public priceElement: ElementHandle | null;
    public valueElement: ElementHandle | null;

    // private sequelize object
    private wrappedSqlOdd: databaseModels.Odd | null;

    // private constructor
    private constructor({
        exchange,
        outcome,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
        updateElementsFunction: Function,
    }) {
        this.wrappedPrice = null;
        this.wrappedValue = null;

        this.wrappedUpdateElementsFunction = updateElementsFunction.bind(this);

        this.exchange = exchange;
        this.outcome = outcome;

        this.priceElement = null;
        this.valueElement = null;

        this.exchange.odds.add(this);
        this.outcome.oddSet.add(this);

        this.wrappedSqlOdd = null;
    }

    // public async constructor
    static async create({
        exchange,
        outcome,
        updateElementsFunction,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
        updateElementsFunction: Function,
    }): Promise<Odd> {
        const newOdd = new Odd({
            exchange: exchange,
            outcome: outcome,
            updateElementsFunction: updateElementsFunction,
        });

        await newOdd.initSqlOdd();

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    // private sequelize instance constructor
    private async initSqlOdd(): Promise<databaseModels.Odd> {
        const exchange = this.exchange;
        const outcome = this.outcome;

        const exchangeId = exchange.sqlExchange.get('id');
        const outcomeId = outcome.sqlOutcome.get('id');
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

    // public instance methods
    public async checkForArbitrage() {

        const oppositeOutcome = this.outcome.oppositeOutcome;

        for (const odd of oppositeOutcome.oddSet) {
            const oppositeImpliedProbability = odd.impliedProbability;

            const sum = this.impliedProbability + oppositeImpliedProbability;

            if (sum < 1) {
                console.log(
                    `ARB A: ${this.exchange.name} ${this.outcome.game.regionAbbrIdentifierAbbr} ${this.outcome.name} ${this.getPrice}
                    ARB B: ${odd.exchange.name} ${odd.outcome.game.regionAbbrIdentifierAbbr} ${odd.outcome.name} ${odd.getPrice}`
                );
            }
        }
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
    };

    public async updateElements() {
        await this.wrappedUpdateElementsFunction();
    }

    public async updateValues(): Promise<{
        priceValue: number | null,
        valueValue: number | null,
    }> {
        const priceElement = this.priceElement;
        const valueElement = this.valueElement;

        if (!priceElement) {
            await this.setPrice(null);
        } else {
            const priceJson = await (await priceElement.getProperty('textContent')).jsonValue();

            if (!priceJson) {
                await this.setPrice(null);
            } else {
                const hyphenVariations = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g;
                const nonNumericChars = /[^0-9.-]/g;
        
                const cleanedPriceJson = priceJson
                    .replace(hyphenVariations, '-')
                    .replace(nonNumericChars, '');
        
                const price = Number(cleanedPriceJson);

                await this.setPrice(price);
            }
        }

        if (!valueElement) {
            await this.setValue(null);
        } else {
            const valueJson = await (await valueElement.getProperty('textContent')).jsonValue();

            if (!valueJson) {
                await this.setValue(null);
            } else {
                const hyphenVariations = /[\u2010\u2011\u2012\u2013\u2014\u2015]/g;
                const nonNumericChars = /[^0-9.-]/g;
        
                const cleanedValueJson = valueJson
                    .replace(hyphenVariations, '-')
                    .replace(nonNumericChars, '');
        
                const value = Number(cleanedValueJson);

                await this.setValue(value);
            }
        }

        return {
            priceValue: this.getPrice(),
            valueValue: this.getValue(),
        }
    }

    // getters and setters
    get impliedProbability(): number {
        const price = this.getPrice();

        if (!price) {
            throw new Error(`Could not calculate implied probability.`);
        }

        if (price > 0) {
            const risk = 100;
            const payout = 100 + price;
            return risk/payout;
        }

        if (price < 0) {
            const risk = -price;
            const payout = -price + 100;
            return risk/payout;
        }

        throw new Error(`Could not calculate implied probability.`);
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

    get sqlOdd(): databaseModels.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`${this.exchange.name} ${this.outcome.name} sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }

    set sqlOdd(sqlOdd: databaseModels.Odd) {
        this.wrappedSqlOdd = sqlOdd;
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
}