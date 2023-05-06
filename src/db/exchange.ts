import * as s from 'sequelize';

import { sequelize } from './instance';
import { League } from './league';
import { ExchangeLeague } from './exchangeLeague';

export class Exchange extends s.Model<
    s.InferAttributes<Exchange, { omit: 'leagues' }>,
    s.InferCreationAttributes<Exchange, { omit: 'leagues' }>
> {
    declare id: s.CreationOptional<number>;
    declare name: string;
    declare baseUrl: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare leagues?: s.NonAttribute<League[]>;

    // belongsToMany(League)
    declare getLeagues: s.BelongsToManyGetAssociationsMixin<League>;
    declare addLeague: s.BelongsToManyAddAssociationMixin<League, number>;
    declare addLeagues: s.BelongsToManyAddAssociationsMixin<League, number>;
    declare setLeagues: s.BelongsToManySetAssociationsMixin<League, number>;
    declare removeLeague: s.BelongsToManyRemoveAssociationMixin<League, number>;
    declare removeLeagues: s.BelongsToManyRemoveAssociationsMixin<League, number>;
    declare hasLeague: s.BelongsToManyHasAssociationMixin<League, number>;
    declare hasLeagues: s.BelongsToManyHasAssociationsMixin<League, number>;
    declare countLeagues: s.BelongsToManyCountAssociationsMixin;
    declare createLeague: s.BelongsToManyCreateAssociationMixin<League>;

    // hasMany(ExchangeLeague)
    declare getExchangeLeagues: s.HasManyGetAssociationsMixin<ExchangeLeague>;
    declare addExchangeLeague: s.HasManyAddAssociationMixin<ExchangeLeague, number>;
    declare addExchangeLeagues: s.HasManyAddAssociationsMixin<ExchangeLeague, number>;
    declare setExchangeLeagues: s.HasManySetAssociationsMixin<ExchangeLeague, number>;
    declare removeExchangeLeague: s.HasManyRemoveAssociationMixin<ExchangeLeague, number>;
    declare removeExchangeLeagues: s.HasManyRemoveAssociationsMixin<ExchangeLeague, number>;
    declare hasExchangeLeague: s.HasManyHasAssociationMixin<ExchangeLeague, number>;
    declare hasExchangeLeagues: s.HasManyHasAssociationsMixin<ExchangeLeague, number>;
    declare countExchangeLeagues: s.HasManyCountAssociationsMixin;
    declare createExchangeLeague: s.HasManyCreateAssociationMixin<ExchangeLeague, 'exchangeId'>;
    

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