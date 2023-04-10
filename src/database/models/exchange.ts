import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Game } from './game';
import { ContinuousOdd } from './continuousOdd';
import { DiscreteOdd } from './discreteOdd';

export class Exchange extends sqlz.Model<
  sqlz.InferAttributes<Exchange, { omit: 'games' | 'continuousOdds' | 'discreteOdds'}>,
  sqlz.InferCreationAttributes<Exchange, { omit: 'games' | 'continuousOdds' | 'discreteOdds'}>
> {
  // id
  declare id: sqlz.CreationOptional<number>;

  // column headers
  declare name: string;
  declare url: string;

  // timestamps
  declare createdAt: sqlz.CreationOptional<Date>;
  declare updatedAt: sqlz.CreationOptional<Date>;

  // foreign keys
  // none, all associated sequelize models are plural

  // associated sequelize model(s)
  declare games?: sqlz.NonAttribute<Game[]>;
  declare continuousOdds?: sqlz.NonAttribute<ContinuousOdd[]>;
  declare discreteOdds?: sqlz.NonAttribute<DiscreteOdd[]>;

  // virtual model associations
  // belongsToMany(Game)
  declare getGames: sqlz.BelongsToManyGetAssociationsMixin<Game>;
  declare addGame: sqlz.BelongsToManyAddAssociationMixin<Game, number>;
  declare addGames: sqlz.BelongsToManyAddAssociationsMixin<Game, number>;
  declare setGames: sqlz.BelongsToManySetAssociationsMixin<Game, number>;
  declare removeGame: sqlz.BelongsToManyRemoveAssociationMixin<Game, number>;
  declare removeGames: sqlz.BelongsToManyRemoveAssociationsMixin<Game, number>;
  declare hasGame: sqlz.BelongsToManyHasAssociationMixin<Game, number>;
  declare hasGames: sqlz.BelongsToManyHasAssociationsMixin<Game, number>;
  declare countGames: sqlz.BelongsToManyCountAssociationsMixin;
  declare createGame: sqlz.BelongsToManyCreateAssociationMixin<Game>;
  
  // hasMany(ContinuousOdd)
  declare getContinuousOdds: sqlz.HasManyGetAssociationsMixin<ContinuousOdd>;
  declare addContinuousOdd: sqlz.HasManyAddAssociationMixin<ContinuousOdd, number>;
  declare addContinuousOdds: sqlz.HasManyAddAssociationsMixin<ContinuousOdd, number>;
  declare setContinuousOdds: sqlz.HasManySetAssociationsMixin<ContinuousOdd, number>;
  declare removeContinuousOdd: sqlz.HasManyRemoveAssociationMixin<ContinuousOdd, number>;
  declare removeContinuousOdds: sqlz.HasManyRemoveAssociationsMixin<ContinuousOdd, number>;
  declare hasContinuousOdd: sqlz.HasManyHasAssociationMixin<ContinuousOdd, number>;
  declare hasContinuousOdds: sqlz.HasManyHasAssociationsMixin<ContinuousOdd, number>;
  declare countContinuousOdds: sqlz.HasManyCountAssociationsMixin;
  declare createContinuousOdd: sqlz.HasManyCreateAssociationMixin<ContinuousOdd, 'exchangeId'>;

  // hasMany(DiscreteOdd)
  declare getDiscreteOdds: sqlz.HasManyGetAssociationsMixin<DiscreteOdd>;
  declare addDiscreteOdd: sqlz.HasManyAddAssociationMixin<DiscreteOdd, number>;
  declare addDiscreteOdds: sqlz.HasManyAddAssociationsMixin<DiscreteOdd, number>;
  declare setDiscreteOdds: sqlz.HasManySetAssociationsMixin<DiscreteOdd, number>;
  declare removeDiscreteOdd: sqlz.HasManyRemoveAssociationMixin<DiscreteOdd, number>;
  declare removeDiscreteOdds: sqlz.HasManyRemoveAssociationsMixin<DiscreteOdd, number>;
  declare hasDiscreteOdd: sqlz.HasManyHasAssociationMixin<DiscreteOdd, number>;
  declare hasDiscreteOdds: sqlz.HasManyHasAssociationsMixin<DiscreteOdd, number>;
  declare countDiscreteOdds: sqlz.HasManyCountAssociationsMixin;
  declare createDiscreteOdd: sqlz.HasManyCreateAssociationMixin<DiscreteOdd, 'exchangeId'>;

  // associated local model
  // none

  // Not sure what the below does, but was included in the example and don't 
  // want to forget.
  // declare static associations: {
  //     games: Association<Exchange, Game>;
  //     odds: Association<Exchange, Odd>;
  // };
}

Exchange.init({
  id: {
      type: sqlz.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
  },
  name: new sqlz.DataTypes.STRING(128),
  url: new sqlz.DataTypes.STRING(128),
  createdAt: sqlz.DataTypes.DATE,
  updatedAt: sqlz.DataTypes.DATE,
}, {
  sequelize,
  tableName: 'exchanges',
});