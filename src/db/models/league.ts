import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { Exchange } from './exchange';
import { Team } from './team';

export class League extends s.Model<s.InferAttributes<League>, s.InferCreationAttributes<League>> {
  declare id: s.CreationOptional<number>;
  declare name: string;
  declare abbreviation: string;
  declare createdAt: s.CreationOptional<Date>;
  declare updatedAt: s.CreationOptional<Date>;

  // hasMany(Team)
  declare getTeams: s.HasManyGetAssociationsMixin<Team>;
  declare addTeam: s.HasManyAddAssociationMixin<Team, number>;
  declare addTeams: s.HasManyAddAssociationsMixin<Team, number>;
  declare setTeams: s.HasManySetAssociationsMixin<Team, number>;
  declare removeTeam: s.HasManyRemoveAssociationMixin<Team, number>;
  declare removeTeams: s.HasManyRemoveAssociationsMixin<Team, number>;
  declare hasTeam: s.HasManyHasAssociationMixin<Team, number>;
  declare hasTeams: s.HasManyHasAssociationsMixin<Team, number>;
  declare countTeams: s.HasManyCountAssociationsMixin;
  declare createTeam: s.HasManyCreateAssociationMixin<Team, 'leagueId'>;

  // belongsToMany(Exchange)
  declare getExchanges: s.BelongsToManyGetAssociationsMixin<Exchange>;
  declare addExchange: s.BelongsToManyAddAssociationMixin<Exchange, number>;
  declare addExchanges: s.BelongsToManyAddAssociationsMixin<Exchange, number>;
  declare setExchanges: s.BelongsToManySetAssociationsMixin<Exchange, number>;
  declare removeExchange: s.BelongsToManyRemoveAssociationMixin<Exchange, number>;
  declare removeExchanges: s.BelongsToManyRemoveAssociationsMixin<Exchange, number>;
  declare hasExchange: s.BelongsToManyHasAssociationMixin<Exchange, number>;
  declare hasExchanges: s.BelongsToManyHasAssociationsMixin<Exchange, number>;
  declare countExchanges: s.BelongsToManyCountAssociationsMixin;
  declare createExchange: s.BelongsToManyCreateAssociationMixin<Exchange>;
}

League.init(
  {
    id: {
      type: s.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: new s.DataTypes.STRING(128),
    abbreviation: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
  },
  {
    sequelize: sequelize,
    tableName: 'Leagues',
  }
);
