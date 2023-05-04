import { ElementHandle } from 'puppeteer';

import * as database from '../../../database';
import * as global from '../../../global';
import * as models from '../../../models';

export abstract class Odd {
    protected wrappedPrice: number | null;
    protected wrappedValue: number | null;
    protected priceElement: ElementHandle | null;
    protected valueElement: ElementHandle | null;
    protected wrappedExchange: models.Exchange;
    protected wrappedOutcome: models.Outcome;
    protected wrappedSqlOdd: database.Odd | null;

    constructor({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }) {
        this.wrappedPrice = null;
        this.wrappedValue = null;
        this.priceElement = null;
        this.valueElement = null;
        this.wrappedExchange = exchange;
        this.wrappedOutcome = outcome;
        this.wrappedSqlOdd = null;

        exchange.odds.add(this);
        outcome.odds.add(this);
    }

    public static async create({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }): Promise<Odd> {;
        let newOdd: models.Odd;

        switch (exchange) {
            case global.draftKingsExchange:
                switch (outcome.type) {
                    case models.OutcomeType.SpreadAway:
                        newOdd = new models.DraftKingsSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.SpreadHome:
                        newOdd = new models.DraftKingsSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineAway:
                        newOdd = new models.DraftKingsMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineHome:
                        newOdd = new models.DraftKingsMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalOver:
                        newOdd = new models.DraftKingsTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalUnder:
                        newOdd = new models.DraftKingsTotalUnder({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    default:
                        throw new Error(`Did not find corresponding DraftKings odd.`);
                }
                break;
            case global.fanDuelExchange:
                switch (outcome.type) {
                    case models.OutcomeType.SpreadAway:
                        newOdd = new models.FanDuelSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.SpreadHome:
                        newOdd = new models.FanDuelSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineAway:
                        newOdd = new models.FanDuelMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineHome:
                        newOdd = new models.FanDuelMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalOver:
                        newOdd = new models.FanDuelTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalUnder:
                        newOdd = new models.FanDuelTotalUnder({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    default:
                        throw new Error(`Did not find corresponding FanDuel odd.`);
                }
                break;
            case global.sugarHouseExchange:
                switch (outcome.type) {
                    case models.OutcomeType.SpreadAway:
                        newOdd = new models.SugarHouseSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.SpreadHome:
                        newOdd = new models.SugarHouseSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineAway:
                        newOdd = new models.SugarHouseMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.MoneylineHome:
                        newOdd = new models.SugarHouseMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalOver:
                        newOdd = new models.SugarHouseTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case models.OutcomeType.TotalUnder:
                        newOdd = new models.SugarHouseTotalUnder({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    default:
                        throw new Error(`Did not find corresponding SugarHouse odd.`);
                }
                break;
            default:
                throw new Error(`Did not find corresponding exchange.`)
        }

        global.allOdds.add(newOdd);
        return newOdd;
    }

    private async initSqlOdd({
        price,
        value,
    }: {
        price: number | null,
        value: number | null,
    }): Promise<database.Odd> {
        const exchangeId = this.exchange.sqlExchange.get('id');
        const outcomeId = this.outcome.sqlOutcome.get('id');

        await database.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                outcomeId: outcomeId,
            },
            defaults: {
                exchangeId: exchangeId,
                outcomeId: outcomeId,
                price: price,
                value: value,
            },
        }).then(async ([sqlOdd, created]) => {
            this.wrappedSqlOdd = sqlOdd;

            if (!created) {
                await this.updatePriceAndValue({
                    price: price,
                    value: value,
                })
            }
        });

        return this.sqlOdd;
    }

    public matches({
        exchange,
        outcome,
    }: {
        exchange: models.Exchange,
        outcome: models.Outcome,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const outcomeMatches = (this.outcome === outcome);

        if (exchangeMatches && outcomeMatches) {
            return true;
        }

        return false;
    }

    public async getElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }> {
        const priceElement = await this.getPriceElement();
        const valueElement = await this.getValueElement();

        this.priceElement = priceElement;
        this.valueElement = valueElement;

        return {
            priceElement: priceElement,
            valueElement: valueElement,
        }
    }

    protected abstract getPriceElement(): Promise<ElementHandle | null>;

    protected abstract getValueElement(): Promise<ElementHandle | null>;

    public async getValues(): Promise<{
        priceValue: number | null,
        valueValue: number | null,
    }> {
        const priceValue = await this.getPriceValue();
        const valueValue = await this.getValueValue();

        await this.setPriceAndValue({
            price: priceValue,
            value: valueValue,
        });

        return {
            priceValue: priceValue,
            valueValue: valueValue,
        }
    }

    private async getPriceValue(): Promise<number | null> {
        const priceElement = this.priceElement;
        const priceValue = await this.getValue(priceElement);
        return priceValue;
    }

    private async getValueValue(): Promise<number | null> {
        const valueElement = this.valueElement;
        const valueValue = await this.getValue(valueElement);
        return valueValue;
    }

    private async getValue(element: ElementHandle | null): Promise<number | null> {
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

    public async setPriceAndValue({
        price,
        value,
    }: {
        price: number | null,
        value: number | null,
    }): Promise<void> {
        this.wrappedPrice = price;
        this.wrappedValue = value;

        if (!this.wrappedSqlOdd) {
            await this.initSqlOdd({
                price: price,
                value: value,
            });
            return;
        }

        await this.updatePriceAndValue({
            price: price,
            value: value,
        });
        return;
    }

    public async updatePriceAndValue({
        price,
        value,
    }: {
        price: number | null,
        value: number | null,
    }) {
        const oldPrice = this.sqlOdd.price;
        const oldValue = this.sqlOdd.value;

        const priceMatches = (oldPrice === price);
        const valueMatches = (oldValue === value);

        if (!priceMatches || !valueMatches) {
            const oldUpdatedAt = this.sqlOdd.updatedAt;
            const oddId = this.sqlOdd.id;

            await this.sqlOdd.update({
                price: price,
                value: value,
            });

            await database.OldOdd.create({
                price: oldPrice,
                value: oldValue,
                startTime: oldUpdatedAt,
                endTime: this.sqlOdd.updatedAt,
                oddId: oddId,
            });

            console.log('New odd.');
        }
    }

    get impliedProbability(): number | null {
        const price = this.wrappedPrice;

        if (!price) {
            return null;
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

    get exchange(): models.Exchange {
        return this.wrappedExchange;
    }

    get outcome(): models.Outcome {
        return this.wrappedOutcome;
    }

    get sqlOdd(): database.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }
}