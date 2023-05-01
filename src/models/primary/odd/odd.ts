import { ElementHandle } from 'puppeteer';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export abstract class Odd {
    protected wrappedPrice: number | null;
    protected wrappedValue: number | null;
    public priceElement: ElementHandle | null;
    public valueElement: ElementHandle | null;
    protected wrappedExchange: localModels.Exchange;
    protected wrappedOutcome: localModels.Outcome;
    protected wrappedSqlOdd: databaseModels.Odd | null;

    constructor({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }) {
        this.wrappedPrice = null;
        this.wrappedValue = null;

        this.priceElement = null;
        this.valueElement = null;

        this.wrappedExchange = exchange;
        this.wrappedOutcome = outcome;
        this.wrappedSqlOdd = null;

        globalModels.allOdds.add(this);
    }

    public static async create({
        exchange,
        outcome,
        price,
        value,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
        price?: number | null,
        value?: number | null,
    }): Promise<Odd> {;
        let newOdd: localModels.Odd;

        switch (exchange) {
            case globalModels.draftKingsExchange:
                switch (outcome.type) {
                    case localModels.OutcomeType.SpreadAway:
                        newOdd = new localModels.DraftKingsSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.SpreadHome:
                        newOdd = new localModels.DraftKingsSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineAway:
                        newOdd = new localModels.DraftKingsMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineHome:
                        newOdd = new localModels.DraftKingsMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalOver:
                        newOdd = new localModels.DraftKingsTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalUnder:
                        newOdd = new localModels.DraftKingsTotalUnder({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    default:
                        throw new Error(`Did not find corresponding DraftKings odd.`);
                }
                break;
            case globalModels.fanDuelExchange:
                switch (outcome.type) {
                    case localModels.OutcomeType.SpreadAway:
                        newOdd = new localModels.FanDuelSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.SpreadHome:
                        newOdd = new localModels.FanDuelSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineAway:
                        newOdd = new localModels.FanDuelMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineHome:
                        newOdd = new localModels.FanDuelMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalOver:
                        newOdd = new localModels.FanDuelTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalUnder:
                        newOdd = new localModels.FanDuelTotalUnder({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    default:
                        throw new Error(`Did not find corresponding FanDuel odd.`);
                }
                break;
            case globalModels.sugarHouseExchange:
                switch (outcome.type) {
                    case localModels.OutcomeType.SpreadAway:
                        newOdd = new localModels.SugarHouseSpreadAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.SpreadHome:
                        newOdd = new localModels.SugarHouseSpreadHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineAway:
                        newOdd = new localModels.SugarHouseMoneylineAway({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.MoneylineHome:
                        newOdd = new localModels.SugarHouseMoneylineHome({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalOver:
                        newOdd = new localModels.SugarHouseTotalOver({
                            exchange: exchange,
                            outcome: outcome,
                        });
                        break;
                    case localModels.OutcomeType.TotalUnder:
                        newOdd = new localModels.SugarHouseTotalUnder({
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

        return newOdd;
    }

    private async initSqlOdd({
        price,
        value,
    }: {
        price: number | null,
        value: number | null,
    }): Promise<databaseModels.Odd> {
        const exchangeId = this.exchange.sqlExchange.get('id');
        const outcomeId = this.outcome.sqlOutcome.get('id');

        await databaseModels.Odd.findOrCreate({
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
            if (!created) {
                await sqlOdd.update({
                    price: price,
                    value: value,
                });
            }

            this.wrappedSqlOdd = sqlOdd;
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
        this.wrappedPrice = price;
        this.wrappedValue = value;

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

            await databaseModels.OldOdd.create({
                price: oldPrice,
                value: oldValue,
                startTime: oldUpdatedAt,
                endTime: this.sqlOdd.updatedAt,
                oddId: oddId,
            });
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

    get exchange(): localModels.Exchange {
        return this.wrappedExchange;
    }

    get outcome(): localModels.Outcome {
        return this.wrappedOutcome;
    }

    get sqlOdd(): databaseModels.Odd {
        if (!this.wrappedSqlOdd) {
            throw new Error(`sqlOdd is null.`);
        }

        return this.wrappedSqlOdd;
    }
}