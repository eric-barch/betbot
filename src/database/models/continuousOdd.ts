import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Exchange } from './exchange';
import { Statistic } from './statistic';

export class ContinuousOdd extends sqlz.Model<
    sqlz.InferAttributes<ContinuousOdd, { omit: 'exchange' | 'statistic' }>,
    sqlz.InferCreationAttributes<ContinuousOdd, { omit: 'exchange' | 'statistic' }>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare inequality: string;
    declare price: number;
    declare value: number;

    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    // foreign keys
    declare exchangeId: sqlz.ForeignKey<Exchange['id']>;
    declare statisticId: sqlz.ForeignKey<Statistic['id']>;

    // associated sequelize model(s)
    declare exchange?: sqlz.NonAttribute<Exchange>;
    declare statistic?: sqlz.NonAttribute<Statistic>;

    // virtual model associations
    // belongsTo(Exchange)
    declare createExchange: sqlz.BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: sqlz.BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: sqlz.BelongsToSetAssociationMixin<Exchange, number>;

    // belongsTo(Statistic)
    declare createStatistic: sqlz.BelongsToCreateAssociationMixin<Statistic>;
    declare getStatistic: sqlz.BelongsToGetAssociationMixin<Statistic>;
    declare setStatistic: sqlz.BelongsToSetAssociationMixin<Statistic, number>;

    // associated local model
    // none
}

ContinuousOdd.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    inequality: new sqlz.DataTypes.STRING(128),
    price: sqlz.DataTypes.INTEGER,
    value: sqlz.DataTypes.FLOAT,
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'continuous_odds',
});