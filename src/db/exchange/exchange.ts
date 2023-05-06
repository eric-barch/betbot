import * as s from 'sequelize';

import { sequelize } from '../instance';
import * as db from '../../db';

export class Exchange extends s.Model<
    s.InferAttributes<Exchange, { omit: 'leagues' }>,
    s.InferCreationAttributes<Exchange, { omit: 'leagues' }>
> {
    declare id: s.CreationOptional<number>;
    declare name: string;
    declare baseUrl: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare leagues?: s.NonAttribute<db.League[]>;

    // belongsToMany(League)
    declare getLeagues: s.BelongsToManyGetAssociationsMixin<db.League>;
    declare addLeague: s.BelongsToManyAddAssociationMixin<db.League, number>;
    declare addLeagues: s.BelongsToManyAddAssociationsMixin<db.League, number>;
    declare setLeagues: s.BelongsToManySetAssociationsMixin<db.League, number>;
    declare removeLeague: s.BelongsToManyRemoveAssociationMixin<db.League, number>;
    declare removeLeagues: s.BelongsToManyRemoveAssociationsMixin<db.League, number>;
    declare hasLeague: s.BelongsToManyHasAssociationMixin<db.League, number>;
    declare hasLeagues: s.BelongsToManyHasAssociationsMixin<db.League, number>;
    declare countLeagues: s.BelongsToManyCountAssociationsMixin;
    declare createLeague: s.BelongsToManyCreateAssociationMixin<db.League>;

    // hasMany(ExchangeLeague)
    declare getExchangeLeagues: s.HasManyGetAssociationsMixin<db.ExchangeLeague>;
    declare addExchangeLeague: s.HasManyAddAssociationMixin<db.ExchangeLeague, number>;
    declare addExchangeLeagues: s.HasManyAddAssociationsMixin<db.ExchangeLeague, number>;
    declare setExchangeLeagues: s.HasManySetAssociationsMixin<db.ExchangeLeague, number>;
    declare removeExchangeLeague: s.HasManyRemoveAssociationMixin<db.ExchangeLeague, number>;
    declare removeExchangeLeagues: s.HasManyRemoveAssociationsMixin<db.ExchangeLeague, number>;
    declare hasExchangeLeague: s.HasManyHasAssociationMixin<db.ExchangeLeague, number>;
    declare hasExchangeLeagues: s.HasManyHasAssociationsMixin<db.ExchangeLeague, number>;
    declare countExchangeLeagues: s.HasManyCountAssociationsMixin;
    declare createExchangeLeague: s.HasManyCreateAssociationMixin<db.ExchangeLeague, 'exchangeId'>;
    

    // declare static associations: {
    //     leagues: s.Association<Exchange, League>;
    // }
}

Exchange.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: new s.DataTypes.STRING(128),
    baseUrl: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'Exchanges',
})