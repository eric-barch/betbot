import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../global';
import * as localModels from '../../models';

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

        newExchangeGame.exchange = exchange;
        newExchangeGame.game = game;

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
        if (!this.wrappedExchange) {
            throw new Error(`Exchange is null.`);
        }

        return this.wrappedExchange;
    }

    set exchange(exchange: localModels.Exchange) {
        this.wrappedExchange = exchange;
        exchange.exchangeGames.add(this);
    }

    get game(): localModels.Game {
        if (!this.wrappedGame) {
            throw new Error(`Game is null.`);
        }

        return this.wrappedGame;
    }
    
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