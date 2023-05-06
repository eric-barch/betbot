import * as s from 'sequelize';

import { sequelize } from '../instance';
import * as db from '../../db';

export class League extends s.Model<
    s.InferAttributes<League, { omit: 'exchanges' }>,
    s.InferCreationAttributes<League, { omit: 'exchanges' }>
> {
    declare id: s.CreationOptional<Date>;
    declare name: string;
    declare abbreviation: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchanges?: s.NonAttribute<db.Exchange[]>;

    // belongsToMany(Exchange)
    declare getExchanges: s.BelongsToManyGetAssociationsMixin<db.Exchange>;
    declare addExchange: s.BelongsToManyAddAssociationMixin<db.Exchange, number>;
    declare addExchanges: s.BelongsToManyAddAssociationsMixin<db.Exchange, number>;
    declare setExchanges: s.BelongsToManySetAssociationsMixin<db.Exchange, number>;
    declare removeExchange: s.BelongsToManyRemoveAssociationMixin<db.Exchange, number>;
    declare removeExchanges: s.BelongsToManyRemoveAssociationsMixin<db.Exchange, number>;
    declare hasExchange: s.BelongsToManyHasAssociationMixin<db.Exchange, number>;
    declare hasExchanges: s.BelongsToManyHasAssociationsMixin<db.Exchange, number>;
    declare countExchanges: s.BelongsToManyCountAssociationsMixin;
    declare createExchange: s.BelongsToManyCreateAssociationMixin<db.Exchange>;

    // hasMany(Team)
    declare getTeams: s.HasManyGetAssociationsMixin<db.Team>;
    declare addTeam: s.HasManyAddAssociationMixin<db.Team, number>;
    declare addTeams: s.HasManyAddAssociationsMixin<db.Team, number>;
    declare setTeams: s.HasManySetAssociationsMixin<db.Team, number>;
    declare removeTeam: s.HasManyRemoveAssociationMixin<db.Team, number>;
    declare removeTeams: s.HasManyRemoveAssociationsMixin<db.Team, number>;
    declare hasTeam: s.HasManyHasAssociationMixin<db.Team, number>;
    declare hasTeams: s.HasManyHasAssociationsMixin<db.Team, number>;
    declare countTeams: s.HasManyCountAssociationsMixin;
    declare createTeam: s.HasManyCreateAssociationMixin<db.Team, 'leagueId'>;

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
    declare createExchangeLeague: s.HasManyCreateAssociationMixin<db.ExchangeLeague, 'leagueId'>;

    // declare static associations: {
    //     exchanges: s.Association<League, Exchange>;
    //     teams: s.Association<League, Team>;
    // }
}

League.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: new s.DataTypes.STRING(128),
    abbreviation: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'Leagues',
})