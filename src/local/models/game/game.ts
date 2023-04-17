import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Game {
    // public properties
    public startDate: Date;

    // public linked objects
    public awayTeam: localModels.Team;
    public homeTeam: localModels.Team;
    public exchangeGames: localModels.ExchangeGameSet;
    public outcomeSet: localModels.OutcomeSet;

    // private sequelize object
    private wrappedSqlGame: databaseModels.Game | null;

    // private constructor
    private constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }) {
        this.startDate = Game.roundDateToNearestInterval(startDate);

        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.exchangeGames = new localModels.ExchangeGameSet;
        this.outcomeSet = new localModels.OutcomeSet;

        this.wrappedSqlGame = null;
    }

    // public async constructor
    static async create({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): Promise<Game> {
        const newGame = new Game({
            awayTeam: awayTeam,
            homeTeam: homeTeam,
            startDate: startDate,
        });

        await newGame.initSqlGame();

        globalModels.allGames.add(newGame);

        return newGame;
    }

    // private sequelize instance constructor
    private async initSqlGame(): Promise<databaseModels.Game> {
        const awayTeam = this.awayTeam;
        const homeTeam = this.homeTeam;

        const awayTeamId = awayTeam.sqlTeam.get('id');
        const homeTeamId = homeTeam.sqlTeam.get('id');
        
        await databaseModels.Game.findOrCreate({
            where: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: this.startDate,
            },
            defaults: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: this.startDate,
            },
        }).then(async ([sqlGame, created]) => {
            if (!created) {
                await sqlGame.update({
                    
                });
            }

            this.wrappedSqlGame = sqlGame;
        });

        return this.sqlGame;
    }

    // public instance methods
    public matches({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }): boolean {
        startDate = Game.roundDateToNearestInterval(startDate);

        const awayTeamSame = (this.awayTeam === awayTeam);
        const homeTeamSame = (this.homeTeam === homeTeam);
        const startDateSame = (this.startDate.getTime() === startDate.getTime());

        if (awayTeamSame && homeTeamSame && startDateSame) {
            return true;
        }

        return false;
    }

    // public static methods
    static roundDateToNearestInterval(date: Date): Date {
        const ROUND_INTERVAL = 60;
        
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