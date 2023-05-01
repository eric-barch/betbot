import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../models';

export abstract class ExchangeGame {
    private wrappedExchange: localModels.Exchange;
    private wrappedGame: localModels.Game;
    public wrappedExchangeGameAwayTeam: localModels.ExchangeGameTeam | null;
    public wrappedExchangeGameHomeTeam: localModels.ExchangeGameTeam | null;

    protected constructor({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }) {
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        this.wrappedExchangeGameAwayTeam = null;
        this.wrappedExchangeGameHomeTeam = null;
        globalModels.allExchangeGames.add(this);
    }

    static async create({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
    }) {
        let newExchangeGame;

        switch (exchange) {
            case globalModels.draftKingsExchange:
                newExchangeGame = new localModels.DraftKingsExchangeGame({
                    exchange: exchange,
                    game: game,
                });
                break;
            case globalModels.fanDuelExchange:
                newExchangeGame = new localModels.FanDuelExchangeGame({
                    exchange: exchange,
                    game: game,
                });
                break;
            case globalModels.sugarHouseExchange:
                newExchangeGame = new localModels.SugarHouseExchangeGame({
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
        exchangeGameAwayTeam: localModels.ExchangeGameTeam,
        exchangeGameHomeTeam: localModels.ExchangeGameTeam,
    }> {
        const exchangeGameAwayTeam = await this.updateExchangeGameAwayTeam();
        const exchangeGameHomeTeam = await this.updateExchangeGameHomeTeam();
        
        return {
            exchangeGameAwayTeam: exchangeGameAwayTeam,
            exchangeGameHomeTeam: exchangeGameHomeTeam,
        };
    }

    public async updateExchangeGameAwayTeam(): Promise<localModels.ExchangeGameTeam> {
        const exchange = this.exchange;
        const game = this.game;
        const team = game.awayTeam;

        const requestedExchangeGameTeam = await globalModels.allExchangeGameTeams.findOrCreate({
            exchange: exchange,
            game: game,
            team: team,
        });
        
        return requestedExchangeGameTeam;
    }

    public async updateExchangeGameHomeTeam(): Promise<localModels.ExchangeGameTeam> {
        const exchange = this.exchange;
        const game = this.game;
        const team = game.homeTeam;

        const requestedExchangeGameTeam = await globalModels.allExchangeGameTeams.findOrCreate({
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
        exchange: localModels.Exchange,
        game: localModels.Game,
    }): boolean {
        const exchangeMatches = (this.exchange === exchange);
        const gameMatches = (this.game === game);

        if (exchangeMatches && gameMatches) {
            return true;
        }

        return false;
    }

    abstract updateElement(): Promise<ElementHandle | null>;

    get exchange(): localModels.Exchange {
        return this.wrappedExchange;
    }

    /**TODO: Is this used? */
    set exchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
        exchange.exchangeGames.add(this);
    }

    get game(): localModels.Game {
        return this.wrappedGame;
    }
    
    /**TODO: Is this used? */
    set game(game: localModels.Game) {
        this.wrappedGame = game;
        game.exchangeGames.add(this);
    }

    get exchangeGameAwayTeam(): localModels.ExchangeGameTeam {
        if (!this.wrappedExchangeGameAwayTeam) {
            throw new Error(`ExchangeGameAwayTeam is null.`);
        }

        return this.wrappedExchangeGameAwayTeam;
    }

    set exchangeGameAwayTeam(exchangeGameAwayTeam: localModels.ExchangeGameTeam | null) {
        this.wrappedExchangeGameAwayTeam = exchangeGameAwayTeam;
    }

    get exchangeGameHomeTeam(): localModels.ExchangeGameTeam {
        if (!this.wrappedExchangeGameHomeTeam) {
            throw new Error(`ExchangeGameHomeTeam is null.`);
        }

        return this.wrappedExchangeGameHomeTeam;
    }

    set exchangeGameHomeTeam(exchangeGameHomeTeam: localModels.ExchangeGameTeam | null) {
        this.wrappedExchangeGameHomeTeam = exchangeGameHomeTeam;
    }
}