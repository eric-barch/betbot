
import * as sqlz from 'sequelize';

import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../models';

const sequelize = databaseModels.sequelize;

export class Game {
    private wrappedStartDate: Date;
    private wrappedAwayTeam: localModels.Team;
    private wrappedHomeTeam: localModels.Team;
    private wrappedExchangeGames: localModels.ExchangeGameSet;
    private wrappedOutcomes: localModels.OutcomeSet;
    private wrappedSqlGame: databaseModels.Game | null;

    private constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: localModels.Team,
        homeTeam: localModels.Team,
        startDate: Date,
    }) {
        this.wrappedAwayTeam = awayTeam;
        this.wrappedHomeTeam = homeTeam;
        this.wrappedStartDate = startDate;
        this.wrappedExchangeGames = new localModels.ExchangeGameSet;
        this.wrappedOutcomes = new localModels.OutcomeSet;
        this.wrappedSqlGame = null;

        globalModels.allGames.add(this);
    }

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

        return newGame;
    }

    private async initSqlGame(): Promise<databaseModels.Game> {
        const awayTeamId = this.awayTeam.sqlTeam.get('id');
        const homeTeamId = this.homeTeam.sqlTeam.get('id');
        const startDate = this.startDate;
    
        await databaseModels.Game.findOrCreate({
            where: {
                [sqlz.Op.and]: [
                    { awayTeamId: awayTeamId },
                    { homeTeamId: homeTeamId },
                    sequelize.where(
                        sequelize.fn('YEAR', sequelize.col('startDate')),
                        startDate.getUTCFullYear()
                    ),
                    sequelize.where(
                        sequelize.fn('MONTH', sequelize.col('startDate')),
                        startDate.getUTCMonth() + 1,
                    ),
                    sequelize.where(
                        sequelize.fn('DAY', sequelize.col('startDate')),
                        startDate.getUTCDate(),
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

    get regionAbbr(): string {
        const regionAbbr = `${this.awayTeam.regionAbbr} @ ${this.homeTeam.regionAbbr}`;
        return regionAbbr;
    }
    
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

    get startDate(): Date {
        return this.wrappedStartDate;
    }

    get awayTeam(): localModels.Team {
        return this.wrappedAwayTeam;
    }

    get homeTeam(): localModels.Team {
        return this.wrappedHomeTeam;
    }

    get exchangeGames(): localModels.ExchangeGameSet {
        return this.wrappedExchangeGames;
    }

    get outcomes(): localModels.OutcomeSet {
        return this.wrappedOutcomes;
    }

    get sqlGame(): databaseModels.Game {
        if (!this.wrappedSqlGame) {
            throw new Error(`${this.regionAbbrIdentifierAbbr}.sqlGame is null.`);
        }

        return this.wrappedSqlGame;
    }
}