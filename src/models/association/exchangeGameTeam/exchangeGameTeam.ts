import { ElementHandle } from 'puppeteer';

import * as globalModels from '../../../global';
import * as localModels from '../../../models';

enum AwayOrHome {
    Away = 'away',
    Home = 'home',
}

export abstract class ExchangeGameTeam {
    protected wrappedExchange: localModels.Exchange;
    protected wrappedGame: localModels.Game;
    protected wrappedTeam: localModels.Team;
    protected wrappedExchangeGame: localModels.ExchangeGame | null;

    protected constructor({
        exchange,
        game,
        team,
    }: {
        exchange: localModels.Exchange,
        game: localModels.Game,
        team: localModels.Team,
    }) {
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        this.wrappedTeam = team;
        this.wrappedExchangeGame = globalModels.allExchangeGames.find({
            exchange: exchange,
            game: game,
        });
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
        let awayOrHome: AwayOrHome | undefined;

        /**TODO: there must be a better way to do this. */
        if (team === game.awayTeam) {
            awayOrHome = AwayOrHome.Away;
        } 
        
        if (team === game.homeTeam) {
            awayOrHome = AwayOrHome.Home;
        }

        let newExchangeGameTeam;

        switch (exchange) {
            case globalModels.draftKingsExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new localModels.DraftKingsExchangeGameAwayTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new localModels.DraftKingsExchangeGameHomeTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    default:
                        throw new Error(`Did not match away or home team.`);
                }
                break;
            case globalModels.fanDuelExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new localModels.FanDuelExchangeGameAwayTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new localModels.FanDuelExchangeGameHomeTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                }
                break;
            case globalModels.sugarHouseExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new localModels.SugarHouseExchangeGameTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new localModels.SugarHouseExchangeGameTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                }
                break;
        }

        if (!newExchangeGameTeam) {
            throw new Error(`Failed to create ExchangeGameTeam.`);
        }

        const exchangeGame = newExchangeGameTeam.exchangeGame;

        switch(awayOrHome) {
            case AwayOrHome.Away:
                exchangeGame.exchangeGameAwayTeam = newExchangeGameTeam;
                break;
            case AwayOrHome.Home:
                exchangeGame.exchangeGameHomeTeam = newExchangeGameTeam;
                break;
            default:
                throw new Error(`Did not link exchangeGame away or home team.`);
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
        const exchangeMatches = (this.exchange === exchange);
        const gameMatches = (this.game === game);
        const teamMatches = (this.team === team);

        if (exchangeMatches && gameMatches && teamMatches) {
            return true;
        }

        return false;
    }

    abstract updateElement(): Promise<ElementHandle | null>;

    get exchange(): localModels.Exchange {
        return this.wrappedExchange;
    }

    get game(): localModels.Game {
        return this.wrappedGame;
    }

    get team(): localModels.Team {
        return this.wrappedTeam;
    }

    get exchangeGame(): localModels.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`)
        }

        return this.wrappedExchangeGame;
    }
}