import * as sqlz from 'sequelize';

import { sequelize } from '../../database';

import { Exchange } from './exchange';
import { Statistic } from './statistic';

export class DiscreteOdd extends sqlz.Model<
    sqlz.InferAttributes<DiscreteOdd, {omit: 'exchange' | 'statistic'}>,
    sqlz.InferCreationAttributes<DiscreteOdd, {omit: 'exchange' | 'statistic'}>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare price: number | null;
    declare value: string;

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

DiscreteOdd.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    price: sqlz.DataTypes.INTEGER,
    value: new sqlz.DataTypes.STRING(128),
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'discrete_odds',
});