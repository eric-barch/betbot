import * as sqlz from 'sequelize';

import { sequelize } from '..';

import { Exchange } from './exchange';
import { Outcome } from './outcome';
import { OldOdd } from './oldOdd';

export class Odd extends sqlz.Model<
    sqlz.InferAttributes<Odd, { omit: 'exchange' | 'outcome' }>,
    sqlz.InferCreationAttributes<Odd, { omit: 'exchange' | 'outcome' }>
> {
    declare id: sqlz.CreationOptional<number>;

    declare price: number | null;
    declare value: number | null;

    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    declare exchangeId: sqlz.ForeignKey<Exchange['id']>;
    declare outcomeId: sqlz.ForeignKey<Outcome['id']>;

    declare exchange?: sqlz.NonAttribute<Exchange>;
    declare outcome?: sqlz.NonAttribute<Outcome>;

    declare createExchange: sqlz.BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: sqlz.BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: sqlz.BelongsToSetAssociationMixin<Exchange, number>;

    declare createOutcome: sqlz.BelongsToCreateAssociationMixin<Outcome>;
    declare getOutcome: sqlz.BelongsToGetAssociationMixin<Outcome>;
    declare setOutcome: sqlz.BelongsToSetAssociationMixin<Outcome, number>;
}

Odd.init({
    id: {
        type: sqlz.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    price: sqlz.DataTypes.INTEGER,
    value: sqlz.DataTypes.FLOAT,
    createdAt: sqlz.DataTypes.DATE,
    updatedAt: sqlz.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'odds',
});

Odd.addHook('afterUpdate', async (odd: Odd, options) => {
    if (!odd.isNewRecord && odd.changed()) {
        const oldData = odd.previous();

        await OldOdd.create({
            price: oldData.price,
            value: oldData.value,
            updatedAt: oldData.updatedAt,
            oddId: odd.id,
        });
    }
});