import { Op } from 'sequelize';

import * as databaseModels from '../../../database';
import * as global from '../../../global';
import * as models from '../../../models';

const sequelize = databaseModels.sequelize;

export class Game {
    private wrappedStartDate: Date;
    private wrappedAwayTeam: models.Team;
    private wrappedHomeTeam: models.Team;
    private wrappedExchangeGames: models.ExchangeGameSet;
    private wrappedOutcomes: models.OutcomeSet;
    private wrappedSqlGame: databaseModels.Game | null;

    private constructor({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
        startDate: Date,
    }) {
        this.wrappedAwayTeam = awayTeam;
        this.wrappedHomeTeam = homeTeam;
        this.wrappedStartDate = startDate;
        this.wrappedExchangeGames = new models.ExchangeGameSet;
        this.wrappedOutcomes = new models.OutcomeSet;
        this.wrappedSqlGame = null;

        global.allGames.add(this);
    }

    public static async create({
        awayTeam,
        homeTeam,
        startDate,
    }: {
        awayTeam: models.Team,
        homeTeam: models.Team,
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
                [Op.and]: [
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
        awayTeam: models.Team,
        homeTeam: models.Team,
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

    get awayTeam(): models.Team {
        return this.wrappedAwayTeam;
    }

    get homeTeam(): models.Team {
        return this.wrappedHomeTeam;
    }

    get exchangeGames(): models.ExchangeGameSet {
        return this.wrappedExchangeGames;
    }

    get outcomes(): models.OutcomeSet {
        return this.wrappedOutcomes;
    }

    get sqlGame(): databaseModels.Game {
        if (!this.wrappedSqlGame) {
            throw new Error(`${this.regionAbbrIdentifierAbbr}.sqlGame is null.`);
        }

        return this.wrappedSqlGame;
    }
}