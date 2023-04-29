import * as sqlz from 'sequelize';

import { sequelize } from '..';

import { Odd } from './odd';

export class OldOdd extends sqlz.Model<
    sqlz.InferAttributes<OldOdd, {omit: 'odd'}>,
    sqlz.InferCreationAttributes<OldOdd, {omit: 'odd'}>
> {
    declare id: sqlz.CreationOptional<number>;

    declare price: number | null;
    declare value: number | null;

    declare createdAt: sqlz.CreationOptional<Date>;
    declare updatedAt: sqlz.CreationOptional<Date>;

    declare oddId: sqlz.ForeignKey<Odd['id']>;

    declare odd?: sqlz.NonAttribute<Odd>;

    declare createOdd: sqlz.BelongsToCreateAssociationMixin<Odd>;
    declare getOdd: sqlz.BelongsToGetAssociationMixin<Odd>;
    declare setOdd: sqlz.BelongsToSetAssociationMixin<Odd, number>;
}

OldOdd.init({
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
    tableName: 'oldOdds',
})