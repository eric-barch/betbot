import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Game {
    public awayTeam: localModels.Team;
    public homeTeam: localModels.Team;
    public startDate: Date;
    public exchangeSet: localModels.ExchangeSet;
    public oddSet: localModels.OddSet;
    
    private wrappedSqlGame: databaseModels.Game | null;

    constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }) {
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;   
        this.startDate = Game.roundDateToNearestInterval(startDate);

        this.exchangeSet = new localModels.ExchangeSet;
        this.oddSet = new localModels.OddSet();
        this.wrappedSqlGame = null;
    }

    // async construction methods
    static async create({
        awayTeam,
        homeTeam,
        exchange,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        exchange?: localModels.Exchange,
        startDate: Date,
    }): Promise<Game> {
        const newGame = new Game({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        })

        await newGame.init();

        if (exchange) {
            newGame.exchangeSet.add(exchange);
            newGame.sqlGame.addExchange(exchange.sqlExchange);

            exchange.gameSet.add(newGame);
            //exchange.sqlExchange.addGame(newGame.sqlGame);
        }

        globalModels.allGames.add(newGame);

        return newGame;
    }

    private async init(): Promise<Game> {
        const awayTeam = this.awayTeam;
        const homeTeam = this.homeTeam;
        const startDate = this.startDate;

        const awayTeamId = awayTeam.sqlTeam.get('id');
        const homeTeamId = homeTeam.sqlTeam.get('id');
        
        await databaseModels.Game.findOrCreate({
            where: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: startDate,
            },
            defaults: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: startDate,
            },
        }).then(([sqlGame, created]) => {
            this.wrappedSqlGame = sqlGame;
        });

        return this;
    }

    // instance methods
    public async getOddByExchange({
        exchange,
        game,
    }: {
        exchange: localModels.Exchange,
        game?: localModels.Game,
    }): Promise<localModels.Odd> {
        let requestedOdd = undefined;

        const gameOdds = this.oddSet;
        for (const odd of gameOdds) {
            if (odd.exchange === exchange) {
                requestedOdd = odd;
                break;
            }
        }
        // If it retrieves an odd where the exchange is exchange, the odd should 
        // already be in exchange's oddSet.

        if (requestedOdd === undefined) {
            requestedOdd = await localModels.Odd.create({
                exchange: exchange,
                game: this,
            });
        }

        if (game) {
            game.oddSet.add(requestedOdd);
        }

        return requestedOdd;
    }

    public matchesByTeamsAndStartDate({
        awayTeam,
        homeTeam,
        exchange,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        exchange?: localModels.Exchange,
        startDate: Date,
    }): boolean {
        startDate = Game.roundDateToNearestInterval(startDate);

        const awayTeamSame = (this.awayTeam === awayTeam);
        const homeTeamSame = (this.homeTeam === homeTeam);
        const startDateSame = (this.startDate.getTime() === startDate.getTime());

        if (awayTeamSame && homeTeamSame && startDateSame) {
            if (exchange) {
                this.exchangeSet.add(exchange);
                exchange.gameSet.add(this);
            }
            
            return true;
        }

        return false;
    }

    // static methods
    static roundDateToNearestInterval(date: Date): Date {
        const ROUND_INTERVAL = 15;
        
        const roundedMinutes = Math.round(date.getMinutes() / ROUND_INTERVAL) * ROUND_INTERVAL;
        const roundedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes, 0);

        return roundedDate;
    }

    // getters and setters
    get regionAbbrIdentifierAbbr(): string {
        const regionAbbrIdentifierAbbr = `${this.awayTeam.regionAbbrIdentifierAbbr} @ ${this.homeTeam.regionAbbrIdentifierAbbr}`;
        return regionAbbrIdentifierAbbr;
    }

    get regionAbbrIdentifierFull(): string {
        const regionAbbrIdentifierFull = `${this.awayTeam.regionAbbrIdentifierFull} @ ${this.homeTeam.regionAbbrIdentifierFull}`;
        return regionAbbrIdentifierFull;
    }

    get regionFullIdentifierFull(): string {
        const regionFullIdentifierFull = `${this.awayTeam.regionFullIdentifierFull} @ ${this.homeTeam.regionFullIdentifierFull}`;
        return regionFullIdentifierFull;
    }

    get sqlGame(): databaseModels.Game {
        if (this.wrappedSqlGame) {
            return this.wrappedSqlGame;
        } else {
            throw new Error(`${this.regionAbbrIdentifierAbbr} sqlGame is null.`);
        }
    }

    set sqlGame(sqlGame: databaseModels.Game) {
        this.wrappedSqlGame = sqlGame;
    }
}