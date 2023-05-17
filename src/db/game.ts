import * as s from 'sequelize';

import { sequelize } from './instance';
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

    // belongsTo(Team)
    declare createTeam: s.BelongsToCreateAssociationMixin<Team>;
    declare getTeam: s.BelongsToGetAssociationMixin<Team>;
    declare setTeam: s.BelongsToSetAssociationMixin<Team, number>;

    static async findByTeamIdsAndStartDate({
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
    sequelize,
    tableName: 'Games'
})