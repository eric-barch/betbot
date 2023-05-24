import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { League } from './league';

export class Team extends s.Model<
  s.InferAttributes<Team, { omit: 'league' }>,
  s.InferCreationAttributes<Team, { omit: 'league' }>
> {
  declare id: s.CreationOptional<number>;
  declare regionFull: string;
  declare regionAbbr: string;
  declare nameFull: string;
  declare nameAbbr: string;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;
  declare leagueId: s.ForeignKey<League['id']>;
  declare league?: s.NonAttribute<League>;

  // belongsTo(League)
  declare createLeague: s.BelongsToCreateAssociationMixin<League>;
  declare getLeague: s.BelongsToGetAssociationMixin<League>;
  declare setLeague: s.BelongsToSetAssociationMixin<League, number>;

  public static async findByUnformattedName({ unformattedName }: { unformattedName: string }) {
    const allTeams = await Team.findAll();

    for (const team of allTeams) {
      const regex = new RegExp(`\\b${team.nameFull}\\b`, 'i');

      if (regex.test(unformattedName)) {
        return team;
      }
    }
    
    throw new Error(`Did not find matching team.`);
  }
}

Team.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    regionFull: new s.DataTypes.STRING(128),
    regionAbbr: new s.DataTypes.STRING(128),
    nameFull: new s.DataTypes.STRING(128),
    nameAbbr: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: 'Teams',
  }
);
