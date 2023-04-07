import * as sqlz from 'sequelize';

import { sequelize } from '../database';

import * as databaseModels from '../../database/models';

export class Odd extends sqlz.Model<
    sqlz.InferAttributes<Odd, {omit: 'exchange' | 'statistic' | 'opposite'}>,
    sqlz.InferCreationAttributes<Odd, {omit: 'exchange' | 'statistic' | 'opposite'}>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare inequality: string;
    declare price: number;
    declare numberValue: number;
    declare stringValue: string;

    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    // foreign keys
    declare exchangeId: sqlz.ForeignKey<databaseModels.Exchange['id']>;
    declare oppositeId: sqlz.ForeignKey<databaseModels.Odd['id']>;
    declare statisticId: sqlz.ForeignKey<databaseModels.Statistic['id']>;

    // associated sequelize model(s)
    declare exchange?: sqlz.NonAttribute<databaseModels.Exchange>;
    declare opposite?: sqlz.NonAttribute<databaseModels.Odd>;
    declare statistic?: sqlz.NonAttribute<databaseModels.Statistic>;

    // virtual model associations
    // belongsTo(Exchange)
    declare createExchange: sqlz.BelongsToCreateAssociationMixin<databaseModels.Exchange>;
    declare getExchange: sqlz.BelongsToGetAssociationMixin<databaseModels.Exchange>;
    declare setExchange: sqlz.BelongsToSetAssociationMixin<databaseModels.Exchange, number>;

    // belongsTo(Odd)
    declare createOdd: sqlz.BelongsToCreateAssociationMixin<databaseModels.Odd>;
    declare getOdd: sqlz.BelongsToGetAssociationMixin<databaseModels.Odd>;
    declare setOdd: sqlz.BelongsToSetAssociationMixin<databaseModels.Odd, number>;

    // belongsTo(Statistic)
    declare createStatistic: sqlz.BelongsToCreateAssociationMixin<databaseModels.Statistic>;
    declare getStatistic: sqlz.BelongsToGetAssociationMixin<databaseModels.Statistic>;
    declare setStatistic: sqlz.BelongsToSetAssociationMixin<databaseModels.Statistic, number>;

    // associated local model
    // none
}

Odd.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    inequality: new sqlz.DataTypes.STRING(128),
    price: sqlz.DataTypes.INTEGER,
    numberValue: sqlz.DataTypes.FLOAT,
    stringValue: new sqlz.DataTypes.STRING(128),
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'odds',
});