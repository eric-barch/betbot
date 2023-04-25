import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class ExchangeGame {
    private wrappedExchange: localModels.Exchange | null = null;
    private wrappedGame: localModels.Game | null = null;

    public wrappedExchangeGameAwayTeam: localModels.ExchangeGameTeam | null = null;
    public wrappedExchangeGameHomeTeam: localModels.ExchangeGameTeam | null = null;;

    public constructor() {        
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

        switch (exchange.name) {
            case 'DraftKings':
                newExchangeGame = new localModels.DraftKingsExchangeGame();
                break;
            case 'FanDuel':
                newExchangeGame = new localModels.FanDuelExchangeGame();
                break;
            case 'SugarHouse':
                newExchangeGame = new localModels.SugarHouseExchangeGame();
                break;
        }

        if (!newExchangeGame) {
            throw new Error(`Did not find corresponding exchange game.`);
        }

        newExchangeGame.setExchange(exchange);
        newExchangeGame.setGame(game);

        globalModels.allExchangeGames.add(newExchangeGame);
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
        const exchange = this.getExchange();
        const game = this.getGame();
        const team = game.awayTeam;

        const requestedExchangeGameTeam = await globalModels.allExchangeGameTeams.findOrCreate({
            exchange: exchange,
            game: game,
            team: team,
        });
        
        return requestedExchangeGameTeam;
    }

    public async updateExchangeGameHomeTeam(): Promise<localModels.ExchangeGameTeam> {
        const exchange = this.getExchange();
        const game = this.getGame();
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
        const exchangeMatches = (this.getExchange() === exchange);
        const gameMatches = (this.getGame() === game);

        if (exchangeMatches && gameMatches) {
            return true;
        }

        return false;
    }

    abstract updateElement(): Promise<ElementHandle | null>;

    public getExchange(): localModels.Exchange {
        if (!this.wrappedExchange) {
            throw new Error(`Exchange is null.`);
        }

        return this.wrappedExchange;
    }

    public setExchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
        exchange.getExchangeGames().add(this);
    }

    public getGame(): localModels.Game {
        if (!this.wrappedGame) {
            throw new Error(`Game is null.`);
        }

        return this.wrappedGame;
    }
    
    public setGame(game: localModels.Game) {
        this.wrappedGame = game;
        game.exchangeGames.add(this);
    }

    public getExchangeGameAwayTeam(): localModels.ExchangeGameTeam {
        if (!this.wrappedExchangeGameAwayTeam) {
            throw new Error(`ExchangeGameAwayTeam is null.`);
        }

        return this.wrappedExchangeGameAwayTeam;
    }

    public setExchangeGameAwayTeam(exchangeGameAwayTeam: localModels.ExchangeGameTeam | null) {
        this.wrappedExchangeGameAwayTeam = exchangeGameAwayTeam;
    }

    public getExchangeGameHomeTeam(): localModels.ExchangeGameTeam {
        if (!this.wrappedExchangeGameHomeTeam) {
            throw new Error(`ExchangeGameHomeTeam is null.`);
        }

        return this.wrappedExchangeGameHomeTeam;
    }

    public setExchangeGameHomeTeam(exchangeGameHomeTeam: localModels.ExchangeGameTeam | null) {
        this.wrappedExchangeGameHomeTeam = exchangeGameHomeTeam;
    }
}