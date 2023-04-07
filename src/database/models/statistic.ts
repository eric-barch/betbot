import * as sqlz from 'sequelize';

import { sequelize } from '../database';

import * as databaseModels from '../../database/models';

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
    declare gameId: sqlz.ForeignKey<databaseModels.Game['id']>;

    // associated sequelize models
    declare game?: sqlz.NonAttribute<databaseModels.Game>;

    // virtual model associations
    // belongsTo(Game)
    declare createGame: sqlz.BelongsToCreateAssociationMixin<databaseModels.Game>;
    declare getGame: sqlz.BelongsToGetAssociationMixin<databaseModels.Game>;
    declare setGame: sqlz.BelongsToSetAssociationMixin<databaseModels.Game, number>;

    // hasMany(Odd)
    declare getOdds: sqlz.HasManyGetAssociationsMixin<databaseModels.Odd>;
    declare addOdd: sqlz.HasManyAddAssociationMixin<databaseModels.Odd, number>;
    declare addOdds: sqlz.HasManyAddAssociationsMixin<databaseModels.Odd, number>;
    declare setOdds: sqlz.HasManySetAssociationsMixin<databaseModels.Odd, number>;
    declare removeOdd: sqlz.HasManyRemoveAssociationMixin<databaseModels.Odd, number>;
    declare removeOdds: sqlz.HasManyRemoveAssociationsMixin<databaseModels.Odd, number>;
    declare hasOdd: sqlz.HasManyHasAssociationMixin<databaseModels.Odd, number>;
    declare hasOdds: sqlz.HasManyHasAssociationsMixin<databaseModels.Odd, number>;
    declare countOdds: sqlz.HasManyCountAssociationsMixin;
    declare createOdd: sqlz.HasManyCreateAssociationMixin<databaseModels.Odd, 'exchangeId'>;

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