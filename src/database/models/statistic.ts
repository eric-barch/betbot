import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Game } from './game';
import { Odd } from './odd';

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
    declare odds?: sqlz.NonAttribute<Odd[]>;

    // virtual model associations
    // belongsTo(Game)
    declare createGame: sqlz.BelongsToCreateAssociationMixin<Game>;
    declare getGame: sqlz.BelongsToGetAssociationMixin<Game>;
    declare setGame: sqlz.BelongsToSetAssociationMixin<Game, number>;

    // hasMany(Odd)
    declare getOdds: sqlz.HasManyGetAssociationsMixin<Odd>;
    declare addOdd: sqlz.HasManyAddAssociationMixin<Odd, number>;
    declare addOdds: sqlz.HasManyAddAssociationsMixin<Odd, number>;
    declare setOdds: sqlz.HasManySetAssociationsMixin<Odd, number>;
    declare removeOdd: sqlz.HasManyRemoveAssociationMixin<Odd, number>;
    declare removeOdds: sqlz.HasManyRemoveAssociationsMixin<Odd, number>;
    declare hasOdd: sqlz.HasManyHasAssociationMixin<Odd, number>;
    declare hasOdds: sqlz.HasManyHasAssociationsMixin<Odd, number>;
    declare countOdds: sqlz.HasManyCountAssociationsMixin;
    declare createOdd: sqlz.HasManyCreateAssociationMixin<Odd, 'statisticId'>;

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