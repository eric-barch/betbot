import { ElementHandle } from 'puppeteer';

import * as global from '../../../global';
import * as models from '../../../models';

export abstract class ExchangeGame {
    private wrappedExchange: models.Exchange;
    private wrappedGame: models.Game;
    public wrappedExchangeGameAwayTeam: models.ExchangeGameTeam | null;
    public wrappedExchangeGameHomeTeam: models.ExchangeGameTeam | null;

    protected constructor({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }) {
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        this.wrappedExchangeGameAwayTeam = null;
        this.wrappedExchangeGameHomeTeam = null;

        exchange.exchangeGames.add(this);
        game.exchangeGames.add(this);
        global.allExchangeGames.add(this);
    }

    static async create({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }) {
        let newExchangeGame;

        switch (exchange) {
            case global.draftKingsExchange:
                newExchangeGame = new models.DraftKingsExchangeGame({
                    exchange: exchange,
                    game: game,
                });
                break;
            case global.fanDuelExchange:
                newExchangeGame = new models.FanDuelExchangeGame({
                    exchange: exchange,
                    game: game,
                });
                break;
            case global.sugarHouseExchange:
                newExchangeGame = new models.SugarHouseExchangeGame({
                    exchange: exchange,
                    game: game,
                });
                break;
            default:
                throw new Error(`Did not find exchange.`);
        }

        return newExchangeGame;
    }

    public async updateExchangeGameTeams(): Promise<{
        exchangeGameAwayTeam: models.ExchangeGameTeam,
        exchangeGameHomeTeam: models.ExchangeGameTeam,
    }> {
        const exchangeGameAwayTeam = await this.updateExchangeGameAwayTeam();
        const exchangeGameHomeTeam = await this.updateExchangeGameHomeTeam();
        
        return {
            exchangeGameAwayTeam: exchangeGameAwayTeam,
            exchangeGameHomeTeam: exchangeGameHomeTeam,
        };
    }

    public async updateExchangeGameAwayTeam(): Promise<models.ExchangeGameTeam> {
        const exchange = this.exchange;
        const game = this.game;
        const team = game.awayTeam;

        const requestedExchangeGameTeam = await global.allExchangeGameTeams.findOrCreate({
            exchange: exchange,
            game: game,
            team: team,
        });
        
        return requestedExchangeGameTeam;
    }

    public async updateExchangeGameHomeTeam(): Promise<models.ExchangeGameTeam> {
        const exchange = this.exchange;
        const game = this.game;
        const team = game.homeTeam;

        const requestedExchangeGameTeam = await global.allExchangeGameTeams.findOrCreate({
            exchange: exchange,
            game: game,
            team: team,
        });

        return requestedExchangeGameTeam;
    }

    public matches({
        exchange,
        game,
    }: {
        exchange: models.Exchange,
        game: models.Game,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const gameMatches = (this.game === game);

        if (exchangeMatches && gameMatches) {
            return true;
        }

        return false;
    }

    abstract updateElement(): Promise<ElementHandle | null>;

    get exchange(): models.Exchange {
        return this.wrappedExchange;
    }

    get game(): models.Game {
        return this.wrappedGame;
    }

    get exchangeGameAwayTeam(): models.ExchangeGameTeam {
        if (!this.wrappedExchangeGameAwayTeam) {
            throw new Error(`ExchangeGameAwayTeam is null.`);
        }

        return this.wrappedExchangeGameAwayTeam;
    }

    set exchangeGameAwayTeam(exchangeGameAwayTeam: models.ExchangeGameTeam | null) {
        this.wrappedExchangeGameAwayTeam = exchangeGameAwayTeam;
    }

    get exchangeGameHomeTeam(): models.ExchangeGameTeam {
        if (!this.wrappedExchangeGameHomeTeam) {
            throw new Error(`ExchangeGameHomeTeam is null.`);
        }

        return this.wrappedExchangeGameHomeTeam;
    }

    set exchangeGameHomeTeam(exchangeGameHomeTeam: models.ExchangeGameTeam | null) {
        this.wrappedExchangeGameHomeTeam = exchangeGameHomeTeam;
    }
}