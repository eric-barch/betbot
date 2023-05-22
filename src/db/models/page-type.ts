import * as s from 'sequelize';

import { sequelize } from '../sequelize-instance';
import { ExchangeLeague } from './exchange-league';

export class PageType extends s.Model<
    s.InferAttributes<PageType>,
    s.InferCreationAttributes<PageType>
> {
    declare id: s.CreationOptional<number>;
    declare name: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;

    // belongsToMany(ExchangeLeague)
    declare getExchangeLeagues: s.BelongsToManyGetAssociationsMixin<ExchangeLeague>;
    declare addExchangeLeague: s.BelongsToManyAddAssociationMixin<ExchangeLeague, number>;
    declare addExchangeLeagues: s.BelongsToManyAddAssociationsMixin<ExchangeLeague, number>;
    declare setExchangeLeagues: s.BelongsToManySetAssociationsMixin<ExchangeLeague, number>;
    declare removeExchangeLeague: s.BelongsToManyRemoveAssociationMixin<ExchangeLeague, number>;
    declare removeExchangeLeagues: s.BelongsToManyRemoveAssociationsMixin<ExchangeLeague, number>;
    declare hasExchangeLeague: s.BelongsToManyHasAssociationMixin<ExchangeLeague, number>;
    declare hasExchangeLeagues: s.BelongsToManyHasAssociationsMixin<ExchangeLeague, number>;
    declare countExchangeLeagues: s.BelongsToManyCountAssociationsMixin;
    declare createExchangeLeague: s.BelongsToManyCreateAssociationMixin<ExchangeLeague>;
}

PageType.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize: sequelize,
    tableName: 'PageTypes',
})