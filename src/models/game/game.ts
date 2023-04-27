import * as sequelize from 'sequelize';

import * as databaseModels from '../../database';
import * as globalModels from '../../global';
import * as localModels from '../../models';

export class Game {
    // public properties
    public startDate: Date;

    // public linked objects
    public awayTeam: localModels.Team;
    public homeTeam: localModels.Team;
    public exchangeGames: localModels.ExchangeGameSet;
    public outcomes: localModels.OutcomeSet;

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
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.startDate = startDate;

        this.exchangeGames = new localModels.ExchangeGameSet;
        this.outcomes = new localModels.OutcomeSet;

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

    private async initSqlGame(): Promise<databaseModels.Game> {
        const awayTeamId = this.awayTeam.sqlTeam.get('id');
        const homeTeamId = this.homeTeam.sqlTeam.get('id');
    
        const startDate = this.startDate;
    
        await databaseModels.Game.findOrCreate({
            where: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                [sequelize.Op.and]: [
                    databaseModels.sequelize.where(
                        databaseModels.sequelize.fn('YEAR', databaseModels.sequelize.col('startDate')),
                        startDate.getFullYear()
                    ),
                    databaseModels.sequelize.where(
                        databaseModels.sequelize.fn('MONTH', databaseModels.sequelize.col('startDate')),
                        startDate.getMonth() + 1
                    ),
                    databaseModels.sequelize.where(
                        databaseModels.sequelize.fn('DAY', databaseModels.sequelize.col('startDate')),
                        startDate.getDate()
                    ),
                ],
            },
            defaults: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: this.startDate,
            },
        }).then(async ([sqlGame, created]) => {
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
        startDate?: Date,
    }): boolean {
        if (!startDate) {
            startDate = new Date();
        }

        const awayTeamMatches = (this.awayTeam === awayTeam);
        const homeTeamMatches = (this.homeTeam === homeTeam);

        const yearMatches = (this.startDate.getFullYear() === startDate.getFullYear());
        const monthMatches = (this.startDate.getMonth() === startDate.getMonth());
        const dateMatches = (this.startDate.getDate() === startDate.getDate());

        const startDateMatches = (yearMatches && monthMatches && dateMatches);

        if (awayTeamMatches && homeTeamMatches && startDateMatches) {
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