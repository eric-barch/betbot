import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export abstract class ExchangeGameTeam {
    public element: ElementHandle | null;

    protected wrappedExchangeGame: localModels.ExchangeGame | null;
    protected wrappedTeam: localModels.Team | null;

    protected constructor() {
        this.element = null;

        this.wrappedExchangeGame = null;
        this.wrappedTeam = null;

        globalModels.allExchangeGameTeams.add(this);
    }

    static async create({
        exchangeGame,
        team,
    }: {
        exchangeGame: localModels.ExchangeGame,
        team: localModels.Team,
    }) {
        const game = exchangeGame.getGame();

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

        switch (exchangeGame.getExchange().name) {
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

        newExchangeGameTeam.setExchangeGame(exchangeGame);
        newExchangeGameTeam.setTeam(team);

        globalModels.allExchangeGameTeams.add(newExchangeGameTeam);
        return newExchangeGameTeam;
    }

    public matches({
        exchangeGame,
        team,
    }: {
        exchangeGame: localModels.ExchangeGame,
        team: localModels.Team,
    }) {
        const exchangeGameMatches = (this.getExchangeGame() === exchangeGame);
        const teamMatches = (this.getTeam() === team);

        if (exchangeGameMatches && teamMatches) {
            return true;
        }

        return false;
    }

    abstract updateElement(): Promise<ElementHandle | null>;

    public getExchangeGame(): localModels.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`);
        }

        return this.wrappedExchangeGame;
    }

    abstract setExchangeGame(exchangeGame: localModels.ExchangeGame): void; 
    // {
    //     this.wrappedExchangeGame = exchangeGame;
    //     exchangeGame.getExchangeGameTeams().add(this);
    // }

    public getTeam(): localModels.Team {
        if (!this.wrappedTeam) {
            throw new Error(`Team is null.`);
        }

        return this.wrappedTeam;
    }

    public setTeam(team: localModels.Team) {
        this.wrappedTeam = team;
    }
}