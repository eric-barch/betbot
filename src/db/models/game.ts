import * as s from 'sequelize';

import { sequelizeInstance } from '../sequelize-instance';
import { Team } from './team';

export class Game extends s.Model<
    s.InferAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>,
    s.InferCreationAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>
> {
    declare id: s.CreationOptional<Date>;
    declare startDate: Date;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare awayTeamId: s.ForeignKey<Team['id']>;
    declare homeTeamId: s.ForeignKey<Team['id']>;
    declare awayTeam: Team;
    declare homeTeam: Team;

    // belongsTo(AwayTeam)
    declare createAwayTeam: s.BelongsToCreateAssociationMixin<Team>;
    declare getAwayTeam: s.BelongsToGetAssociationMixin<Team>;
    declare setAwayTeam: s.BelongsToSetAssociationMixin<Team, number>;

    // belongsTo(HomeTeam)
    declare createHomeTeam: s.BelongsToCreateAssociationMixin<Team>;
    declare getHomeTeam: s.BelongsToGetAssociationMixin<Team>;
    declare setHomeTeam: s.BelongsToSetAssociationMixin<Team, number>;

    static async findByAwayTeamIdHomeTeamIdStartDate({
        awayTeamId,
        homeTeamId,
        startDate,
    }: {
        awayTeamId: number,
        homeTeamId: number,
        startDate: Date,
    }): Promise<Game> {
        const [game, created] = await this.findOrCreate({
            where: {
                [s.Op.and]: [
                    { awayTeamId },
                    { homeTeamId },
                    sequelizeInstance.where(
                        sequelizeInstance.fn('YEAR', sequelizeInstance.col('startDate')),
                        startDate.getUTCFullYear()
                    ),
                    sequelizeInstance.where(
                        sequelizeInstance.fn('MONTH', sequelizeInstance.col('startDate')),
                        startDate.getUTCMonth() + 1,
                    ),
                    sequelizeInstance.where(
                        sequelizeInstance.fn('DAY', sequelizeInstance.col('startDate')),
                        startDate.getUTCDate(),
                    ),
                ],
            },
            defaults: {
                awayTeamId,
                homeTeamId,
                startDate,
            },
        });

        return game;
    }
}

Game.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    startDate: s.DataTypes.DATE,
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize: sequelizeInstance,
    tableName: 'Games'
})