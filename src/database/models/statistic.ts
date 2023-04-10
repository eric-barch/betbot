import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Game } from './game';
import { ContinuousOdd } from './continuousOdd';
import { DiscreteOdd } from './discreteOdd';

export class Statistic extends sqlz.Model<
    sqlz.InferAttributes<Statistic, {omit: 'game'}>,
    sqlz.InferCreationAttributes<Statistic, {omit: 'game'}>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare name: string;

    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    // foreign keys
    declare gameId: sqlz.ForeignKey<Game['id']>;

    // associated sequelize models
    declare game?: sqlz.NonAttribute<Game>;
    declare continuousOdds?: sqlz.NonAttribute<ContinuousOdd[]>;
    declare discreteOdds?: sqlz.NonAttribute<DiscreteOdd[]>;

    // virtual model associations
    // belongsTo(Game)
    declare createGame: sqlz.BelongsToCreateAssociationMixin<Game>;
    declare getGame: sqlz.BelongsToGetAssociationMixin<Game>;
    declare setGame: sqlz.BelongsToSetAssociationMixin<Game, number>;

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
  declare createContinuousOdd: sqlz.HasManyCreateAssociationMixin<ContinuousOdd, 'statisticId'>;

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
  declare createDiscreteOdd: sqlz.HasManyCreateAssociationMixin<DiscreteOdd, 'statisticId'>;

    // associated local model
    // none
}

Statistic.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: new sqlz.DataTypes.STRING(128),
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'statistics'
});