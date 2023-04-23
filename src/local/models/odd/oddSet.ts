import * as globalModels from '../../../global';
import * as localModels from '../../../local';

import { Odd } from "./odd";

export class OddSet extends Set<Odd> {
    public async findOrCreate({
        exchange,
        outcome,
    }: {
        exchange: localModels.Exchange,
        outcome: localModels.Outcome,
    }): Promise<Odd> {
        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                outcome: outcome,
            })) {
                return odd;
            }
            
        }

        const newOdd = await this.makeOdd({
            exchange: exchange,
            outcome: outcome,
        });
        
        this.add(newOdd);
        
        return newOdd;
    }

    async makeOdd({
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
                    newOdd = new localModels.DraftKingsSpreadAway();
                    break;
                case 'spread_home':
                    newOdd = new localModels.DraftKingsSpreadHome();
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.DraftKingsMoneylineAway();
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.DraftKingsMoneylineHome();
                    break;
                case 'total_over':
                    newOdd = new localModels.DraftKingsTotalOver();
                    break;
                case 'total_under':
                    newOdd = new localModels.DraftKingsTotalUnder();
                    break;
                default:
                    throw new Error(`Could not find corresponding DraftKingsOdd`);
            }
        } else if (exchange.name === 'FanDuel') {
            switch (outcome.name) {
                case 'spread_away':
                    newOdd = new localModels.FanDuelSpreadAway();
                    break;
                case 'spread_home':
                    newOdd = new localModels.FanDuelSpreadHome();
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.FanDuelMoneylineAway();
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.FanDuelMoneylineHome();
                    break;
                case 'total_over':
                    newOdd = new localModels.FanDuelTotalOver();
                    break;
                case 'total_under':
                    newOdd = new localModels.FanDuelTotalUnder();
                    break;
                default:
                    throw new Error(`Could not find corresponding FanDuelOdd`);
            }
        } else if (exchange.name === 'SugarHouse') {
            switch (outcome.name) {
                case 'spread_away':
                    newOdd = new localModels.SugarHouseSpreadAway();
                    break;
                case 'spread_home':
                    newOdd = new localModels.SugarHouseSpreadHome();
                    break;
                case 'moneyline_away':
                    newOdd = new localModels.SugarHouseMoneylineAway();
                    break;
                case 'moneyline_home':
                    newOdd = new localModels.SugarHouseMoneylineHome();
                    break;
                case 'total_over':
                    newOdd = new localModels.SugarHouseTotalOver();
                    break;
                case 'total_under':
                    newOdd = new localModels.SugarHouseTotalUnder();
                    break;
                default:
                    throw new Error(`Could not find corresponding SugarHouseOdd`);
            }
        }

        if (!(newOdd instanceof Odd)) {
            throw new Error(`Did not find corresponding exchange.`);
        }

        newOdd.setExchange(exchange);
        newOdd.setOutcome(outcome);

        await newOdd.initSqlOdd();

        globalModels.allOdds.add(newOdd);

        return newOdd;
    }

    public async checkForArbitrage() {
        for (const odd of this) {
            // await odd.checkForArbitrage();
        }
    }

    public async updateElements() {
        for (const odd of this) {
            await odd.updateElements();
        }

        return this;
    }

    public async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}