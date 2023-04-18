import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../local';
import * as updateFunctions from '../../../update';

export class ExchangeGame {
    // private properties
    private wrappedUpdateElementFunction: Function;

    // public linked objects
    public exchange: localModels.Exchange;
    public game: localModels.Game;
    public exchangeGameTeams: localModels.ExchangeGameTeamSet;
    public element: ElementHandle | null;

    // public constructor
    public constructor({
        exchange,
        game,
        updateElementFunction,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        updateElementFunction: Function,
    }) {
        this.wrappedUpdateElementFunction = updateElementFunction.bind(this);

        this.exchange = exchange;
        this.game = game;
        
        this.exchangeGameTeams = new localModels.ExchangeGameTeamSet;
        
        new localModels.ExchangeGameTeam({
            exchangeGame: this,
            team: game.awayTeam,
            updateElementFunction: exchange.updateExchangeGameTeamsFunction,
        })

        new localModels.ExchangeGameTeam({
            exchangeGame: this,
            team: game.homeTeam,
            updateElementFunction: exchange.updateExchangeGameTeamsFunction,
        })
        
        this.element = null;

        exchange.exchangeGames.add(this);
        game.exchangeGames.add(this);
    }

    // public instance methods
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


    public async updateElement() {
        await this.wrappedUpdateElementFunction();
    }

    public async updateExchangeGameTeams() {
        const exchangeGameTeams = this.exchangeGameTeams.updateElements();
        return exchangeGameTeams;
    }
}