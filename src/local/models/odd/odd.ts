import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class Odd {
    abstract priceElementXPath: string;
    abstract valueElementXPath: string | null;

    public priceElement: ElementHandle | null = null;
    public valueElement: ElementHandle | null = null;

    private wrappedPrice: number | null = null;
    private wrappedValue: number | null = null;

    private wrappedExchange: localModels.Exchange;
    private wrappedOutcome: localModels.Outcome;

    private wrappedSqlOdd: databaseModels.Odd | null = null;

    constructor({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }) {
        this.wrappedExchange = exchange;
        this.wrappedOutcome = outcome;

        globalModels.allOdds.add(this);
    }

    static async create({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }): Promise<Odd> {;
        let newOdd;

        if (exchange.name === 'DraftKings') {
            switch (outcome.name) {
                case 'spread_away':
                    newOdd = new localModels.DraftKingsSpreadAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'spread_home':
                    newOdd = new localModels.DraftKingsSpreadHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.DraftKingsMoneylineAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.DraftKingsMoneylineHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_over':
                    newOdd = new localModels.DraftKingsTotalOver({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_under':
                    newOdd = new localModels.DraftKingsTotalUnder({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                default:
                    throw new Error(`Could not find corresponding DraftKingsOdd`);
            }
        } else if (exchange.name === 'FanDuel') {
            switch (outcome.name) {
                case 'spread_away':
                    newOdd = new localModels.FanDuelSpreadAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'spread_home':
                    newOdd = new localModels.FanDuelSpreadHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.FanDuelMoneylineAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.FanDuelMoneylineHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_over':
                    newOdd = new localModels.FanDuelTotalOver({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_under':
                    newOdd = new localModels.FanDuelTotalUnder({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                default:
                    throw new Error(`Could not find corresponding FanDuelOdd`);
            }
        } else if (exchange.name === 'SugarHouse') {
            switch (outcome.name) {
                case 'spread_away':
                    newOdd = new localModels.SugarHouseSpreadAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'spread_home':
                    newOdd = new localModels.SugarHouseSpreadHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.SugarHouseMoneylineAway({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.SugarHouseMoneylineHome({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_over':
                    newOdd = new localModels.SugarHouseTotalOver({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                case 'total_under':
                    newOdd = new localModels.SugarHouseTotalUnder({
                        exchange: exchange,
                        outcome: outcome,
                    });
                    break;
                default:
                    throw new Error(`Could not find corresponding SugarHouseOdd`);
            }
        }

        if (!(newOdd instanceof Odd)) {
            throw new Error(`Did not find corresponding exchange.`);
        }
        
        const exchangeGame = await globalModels.allExchangeGames.findOrCreate({
            exchange: exchange,
            game: outcome.game,
        })

        newOdd.setExchange(exchange);
        newOdd.setOutcome(outcome);

        await newOdd.initSqlOdd();

        globalModels.allOdds.add(newOdd);

        return newOdd;
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

    public async checkForArbs(oppositeOdds: localModels.OddSet): Promise<Array<localModels.Arb> | null> {
        const price = this.getPrice();
        const value = this.getValue();

        if (!price) {
            return null;
        }

        const arbs = new Array<localModels.Arb>;

        for (const oppositeOdd of oppositeOdds) {
            const isArb = this.checkIfArb(oppositeOdd);

            if (isArb) {
                const newArb = await globalModels.allArbs.findOrCreate({
                    oddA: this,
                    oddB: oppositeOdd,
                });

                arbs.push(newArb);
            }
        }

        return arbs;
    }

    public checkIfArb(oppositeOdd: localModels.Odd): boolean {
        const thisImpliedProbability = this.impliedProbability;
        let thisValue = this.getValue();
        const oppositeImpliedProbability = oppositeOdd.impliedProbability;
        let oppositeValue = oppositeOdd.getValue();

        if (thisValue) {
            thisValue = Math.abs(thisValue);
        }

        if (oppositeValue) {
            oppositeValue = Math.abs(oppositeValue);
        }

        if (thisValue !== oppositeValue) {
            return false;
        }

        const totalImpliedProbability = thisImpliedProbability + oppositeImpliedProbability;

        if (totalImpliedProbability > 1) {
            return false;
        }

        return true;
    }

    get impliedProbability(): number {
        const price = this.getPrice();

        if (!price) {
            throw new Error(`price is null.`);
        }

        if (price < 0) {
            const risk = -price;
            const payout = (-price) + 100;
            return risk/payout;
        }

        const risk = 100;
        const payout = price + 100;
        return risk/payout;
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