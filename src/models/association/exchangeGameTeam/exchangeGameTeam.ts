import { ElementHandle } from 'puppeteer';

import * as global from '../../../global';
import * as models from '../../../models';

enum AwayOrHome {
    Away = 'away',
    Home = 'home',
}

export abstract class ExchangeGameTeam {
    protected wrappedExchange: models.Exchange;
    protected wrappedGame: models.Game;
    protected wrappedTeam: models.Team;
    protected wrappedExchangeGame: models.ExchangeGame | null;

    protected constructor({
        exchange,
        game,
        team,
    }: {
        exchange: models.Exchange,
        game: models.Game,
        team: models.Team,
    }) {
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        this.wrappedTeam = team;
        this.wrappedExchangeGame = global.allExchangeGames.find({
            exchange: exchange,
            game: game,
        });
        global.allExchangeGameTeams.add(this);
    }

    static async create({
        exchange,
        game,
        team,
    }: {
        exchange: models.Exchange,
        game: models.Game,
        team: models.Team,
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
            case global.draftKingsExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new models.DraftKingsExchangeGameAwayTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new models.DraftKingsExchangeGameHomeTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    default:
                        throw new Error(`Did not match away or home team.`);
                }
                break;
            case global.fanDuelExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new models.FanDuelExchangeGameAwayTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new models.FanDuelExchangeGameHomeTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                }
                break;
            case global.sugarHouseExchange:
                switch(awayOrHome) {
                    case AwayOrHome.Away:
                        newExchangeGameTeam = new models.SugarHouseExchangeGameTeam({
                            exchange: exchange,
                            game: game,
                            team: team,
                        });
                        break;
                    case AwayOrHome.Home:
                        newExchangeGameTeam = new models.SugarHouseExchangeGameTeam({
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

        global.allExchangeGameTeams.add(newExchangeGameTeam);
        return newExchangeGameTeam;
    }

    public matches({
        exchange,
        game,
        team,
    }: {
        exchange: models.Exchange,
        game: models.Game,
        team: models.Team,
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

    get exchange(): models.Exchange {
        return this.wrappedExchange;
    }

    get game(): models.Game {
        return this.wrappedGame;
    }

    get team(): models.Team {
        return this.wrappedTeam;
    }

    get exchangeGame(): models.ExchangeGame {
        if (!this.wrappedExchangeGame) {
            throw new Error(`ExchangeGame is null.`)
        }

        return this.wrappedExchangeGame;
    }
}