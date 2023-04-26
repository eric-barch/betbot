import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../global';
import * as localModels from '../../models';

export abstract class ExchangeGameTeam {
    protected wrappedExchange: localModels.Exchange | null = null;
    protected wrappedGame: localModels.Game | null = null;
    protected wrappedTeam: localModels.Team | null = null;
    protected wrappedExchangeGame: localModels.ExchangeGame | null = null;

    protected constructor() {
        globalModels.allExchangeGameTeams.add(this);
    }

    static async create({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }) {
        let awayOrHome;

        if (team === game.awayTeam) {
            awayOrHome = 'away';
        } else if (team === game.homeTeam) {
            awayOrHome = 'home';
        }

        if (!awayOrHome) {
            throw new Error(`Team does not match game away or home team.`);
        }

        let newExchangeGameTeam;

        switch (exchange.name) {
            case 'DraftKings':
                switch(awayOrHome) {
                    case 'away':
                        newExchangeGameTeam = new localModels.DraftKingsExchangeGameAwayTeam();
                        break;
                    case 'home':
                        newExchangeGameTeam = new localModels.DraftKingsExchangeGameHomeTeam();
                        break;
                }
                break;
            case 'FanDuel':
                switch(awayOrHome) {
                    case 'away':
                        newExchangeGameTeam = new localModels.FanDuelExchangeGameAwayTeam();
                        break;
                    case 'home':
                        newExchangeGameTeam = new localModels.FanDuelExchangeGameHomeTeam();
                        break;
                }
                break;
            case 'SugarHouse':
                switch(awayOrHome) {
                    case 'away':
                        newExchangeGameTeam = new localModels.SugarHouseExchangeGameAwayTeam();
                        break;
                    case 'home':
                        newExchangeGameTeam = new localModels.SugarHouseExchangeGameHomeTeam();
                        break;
                }
                break;
        }

        if (!newExchangeGameTeam) {
            throw new Error(`Did not find corresponding exchange game team.`);
        }

        // Add EGT to EG somewhere around here as away or home team.

        newExchangeGameTeam.setExchange(exchange);
        newExchangeGameTeam.setGame(game);
        newExchangeGameTeam.setTeam(team);

        const exchangeGame = await globalModels.allExchangeGames.findOrCreate({
            exchange: exchange,
            game: game,
        });

        newExchangeGameTeam.setExchangeGame(exchangeGame);

        if (awayOrHome === 'away') {
            exchangeGame.setExchangeGameAwayTeam(newExchangeGameTeam);
        } else if (awayOrHome === 'home') {
            exchangeGame.setExchangeGameHomeTeam(newExchangeGameTeam);
        }

        globalModels.allExchangeGameTeams.add(newExchangeGameTeam);
        return newExchangeGameTeam;
    }

    public matches({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }) {
        const exchangeMatches = (this.getExchange() === exchange);
        const gameMatches = (this.getGame() === game);
        const teamMatches = (this.getTeam() === team);

        if (exchangeMatches && gameMatches && teamMatches) {
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
    }

    public getGame(): localModels.Game {
        if (!this.wrappedGame) {
            throw new Error(`Game is null.`);
        }

        return this.wrappedGame;
    }

    public setGame(game: localModels.Game) {
        this.wrappedGame = game;
    }

    public getTeam(): localModels.Team {
        if (!this.wrappedTeam) {
            throw new Error(`Team is null.`);
        }

        return this.wrappedTeam;
    }

    public setTeam(team: localModels.Team) {
        this.wrappedTeam = team;
    }

    public getExchangeGame(): localModels.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`)
        }

        return this.wrappedExchangeGame;
    }

    public setExchangeGame(exchangeGame: localModels.ExchangeGame) {
        this.wrappedExchangeGame = exchangeGame;
    }
}