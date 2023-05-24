import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { Team } from './team';
import { Page } from './page';

export class Game extends s.Model<
  s.InferAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>,
  s.InferCreationAttributes<Game, { omit: 'awayTeam' | 'homeTeam' }>
> {
  declare id: s.CreationOptional<Date>;
  declare startDate: Date;
  declare awayTeamId: s.ForeignKey<Team['id']>;
  declare homeTeamId: s.ForeignKey<Team['id']>;
  declare awayTeam: Team;
  declare homeTeam: Team;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;

  // belongsTo(AwayTeam)
  declare createAwayTeam: s.BelongsToCreateAssociationMixin<Team>;
  declare getAwayTeam: s.BelongsToGetAssociationMixin<Team>;
  declare setAwayTeam: s.BelongsToSetAssociationMixin<Team, number>;

  // belongsTo(HomeTeam)
  declare createHomeTeam: s.BelongsToCreateAssociationMixin<Team>;
  declare getHomeTeam: s.BelongsToGetAssociationMixin<Team>;
  declare setHomeTeam: s.BelongsToSetAssociationMixin<Team, number>;

  // belongsToMany(Page)
  declare getPages: s.BelongsToManyGetAssociationsMixin<Page>;
  declare addPage: s.BelongsToManyAddAssociationMixin<Page, number>;
  declare addPages: s.BelongsToManyAddAssociationsMixin<Page, number>;
  declare setPages: s.BelongsToManySetAssociationsMixin<Page, number>;
  declare removePage: s.BelongsToManyRemoveAssociationMixin<Page, number>;
  declare removePages: s.BelongsToManyRemoveAssociationsMixin<Page, number>;
  declare hasPage: s.BelongsToManyHasAssociationMixin<Page, number>;
  declare hasPages: s.BelongsToManyHasAssociationsMixin<Page, number>;
  declare countPages: s.BelongsToManyCountAssociationsMixin;
  declare createPage: s.BelongsToManyCreateAssociationMixin<Page>;

  static async findOrCreateByAwayTeamHomeTeamStartDate({
    awayTeam,
    homeTeam,
    startDate,
  }: {
    awayTeam: Team;
    homeTeam: Team;
    startDate: Date;
  }): Promise<Game> {
    const sixHoursInSeconds = 6 * 60 * 60;

    const [game, created] = await this.findOrCreate({
      where: {
        [s.Op.and]: [
          { awayTeamId: awayTeam.id },
          { homeTeamId: homeTeam.id },
          {
            startDate: {
              [s.Op.between]: [
                sequelize.fn(
                  'DATE_SUB',
                  startDate,
                  sequelize.literal(`INTERVAL ${sixHoursInSeconds} SECOND`)
                ),
                sequelize.fn(
                  'DATE_ADD',
                  startDate,
                  sequelize.literal(`INTERVAL ${sixHoursInSeconds} SECOND`)
                ),
              ],
            },
          },
        ],
      },
      defaults: {
        awayTeamId: awayTeam.id,
        homeTeamId: homeTeam.id,
        startDate,
      },
    });

    return game;
  }
}

Game.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    startDate: s.DataTypes.DATE,
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: 'Games',
  }
);
