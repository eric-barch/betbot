import * as sqlz from 'sequelize';

import { sequelize } from '..';

import { Exchange } from './exchange';
import { Outcome } from './outcome';

export class Odd extends sqlz.Model<
    sqlz.InferAttributes<Odd, { omit: 'exchange' | 'outcome' }>,
    sqlz.InferCreationAttributes<Odd, { omit: 'exchange' | 'outcome' }>
> {
    // id
    declare id: sqlz.CreationOptional<number>;

    // column headers
    declare price: number | null;
    declare value: number | null;

    // timestamps
    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    // foreign keys
    declare exchangeId: sqlz.ForeignKey<Exchange['id']>;
    declare outcomeId: sqlz.ForeignKey<Outcome['id']>;

    // associated sequelize model(s)
    declare exchange?: sqlz.NonAttribute<Exchange>;
    declare outcome?: sqlz.NonAttribute<Outcome>;

    // virtual model associations
    // belongsTo(Exchange)
    declare createExchange: sqlz.BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: sqlz.BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: sqlz.BelongsToSetAssociationMixin<Exchange, number>;

    // belongsTo(Outcome)
    declare createOutcome: sqlz.BelongsToCreateAssociationMixin<Outcome>;
    declare getOutcome: sqlz.BelongsToGetAssociationMixin<Outcome>;
    declare setOutcome: sqlz.BelongsToSetAssociationMixin<Outcome, number>;

    // associated local model
    // none
}

Odd.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    price: sqlz.DataTypes.INTEGER,
    value: sqlz.DataTypes.FLOAT,
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'odds',
});