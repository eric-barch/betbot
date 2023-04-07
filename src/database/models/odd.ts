import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Exchange } from './exchange';
import { Statistic } from './statistic';

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
    declare exchangeId: sqlz.ForeignKey<Exchange['id']>;
    declare oppositeId: sqlz.ForeignKey<Odd['id']>;
    declare statisticId: sqlz.ForeignKey<Statistic['id']>;

    // associated sequelize model(s)
    declare exchange?: sqlz.NonAttribute<Exchange>;
    declare opposite?: sqlz.NonAttribute<Odd>;
    declare statistic?: sqlz.NonAttribute<Statistic>;

    // virtual model associations
    // belongsTo(Exchange)
    declare createExchange: sqlz.BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: sqlz.BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: sqlz.BelongsToSetAssociationMixin<Exchange, number>;

    // belongsTo(Odd)
    declare createOdd: sqlz.BelongsToCreateAssociationMixin<Odd>;
    declare getOdd: sqlz.BelongsToGetAssociationMixin<Odd>;
    declare setOdd: sqlz.BelongsToSetAssociationMixin<Odd, number>;

    // belongsTo(Statistic)
    declare createStatistic: sqlz.BelongsToCreateAssociationMixin<Statistic>;
    declare getStatistic: sqlz.BelongsToGetAssociationMixin<Statistic>;
    declare setStatistic: sqlz.BelongsToSetAssociationMixin<Statistic, number>;

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