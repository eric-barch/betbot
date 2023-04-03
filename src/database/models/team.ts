import {
    BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin,
    BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin,
    BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    CreationOptional,
    DataTypes, ForeignKey,
    HasManyAddAssociationMixin, HasManyAddAssociationsMixin,
    HasManyCountAssociationsMixin, HasManyCreateAssociationMixin,
    HasManyGetAssociationsMixin,
    HasManyHasAssociationMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin,
    HasManySetAssociationsMixin,
    InferAttributes, InferCreationAttributes,
    Model,
    NonAttribute
} from 'sequelize';

import { sequelize } from '../database';

import { Exchange } from './exchange';
import { Game } from './game';
import { Odd } from './odd';

export class Team extends Model<
    InferAttributes<Team, {omit: 'exchanges' | 'games' | 'odds'}>,
    InferCreationAttributes<Team, {omit: 'exchanges' | 'games' | 'odds'}>
> {
    // id
    declare id: CreationOptional<number>;

    // column headers
    declare regionFull: string;
    declare regionAbbr: string;
    declare identifierFull: string;
    declare identifierAbbr: string;

    // timestamps
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // foreign keys
    // none, all associated sequelize models are plural

    // associated sequelize models
    declare exchanges?: NonAttribute<Exchange[]>;
    declare games?: NonAttribute<Game[]>;
    declare odds?: NonAttribute<Odd[]>;

    // virtual model associations
    // belongsToMany(Exchange)
    declare getExchanges: BelongsToManyGetAssociationsMixin<Exchange>;
    declare addExchange: BelongsToManyAddAssociationMixin<Exchange, number>;
    declare addExchanges: BelongsToManyAddAssociationsMixin<Exchange, number>;
    declare setExchanges: BelongsToManySetAssociationsMixin<Exchange, number>;
    declare removeExchange: BelongsToManyRemoveAssociationMixin<Exchange, number>;
    declare removeExchanges: BelongsToManyRemoveAssociationsMixin<Exchange, number>;
    declare hasExchange: BelongsToManyHasAssociationMixin<Exchange, number>;
    declare hasExchanges: BelongsToManyHasAssociationsMixin<Exchange, number>;
    declare countExchanges: BelongsToManyCountAssociationsMixin;
    declare createExchange: BelongsToManyCreateAssociationMixin<Exchange>;

    // hasMany(Game)
    declare getGames: HasManyGetAssociationsMixin<Game>;
    declare addGame: HasManyAddAssociationMixin<Game, number>;
    declare addGames: HasManyAddAssociationsMixin<Game, number>;
    declare setGames: HasManySetAssociationsMixin<Game, number>;
    declare removeGame: HasManyRemoveAssociationMixin<Game, number>;
    declare removeGames: HasManyRemoveAssociationsMixin<Game, number>;
    declare hasGame: HasManyHasAssociationMixin<Game, number>;
    declare hasGames: HasManyHasAssociationsMixin<Game, number>;
    declare countGames: HasManyCountAssociationsMixin;
    declare createGame: HasManyCreateAssociationMixin<Game, 'awayTeamId' | 'homeTeamId'>;

    // hasMany(Odd)
    declare getOdds: HasManyGetAssociationsMixin<Odd>;
    declare addOdd: HasManyAddAssociationMixin<Odd, number>;
    declare addOdds: HasManyAddAssociationsMixin<Odd, number>;
    declare setOdds: HasManySetAssociationsMixin<Odd, number>;
    declare removeOdd: HasManyRemoveAssociationMixin<Odd, number>;
    declare removeOdds: HasManyRemoveAssociationsMixin<Odd, number>;
    declare hasOdd: HasManyHasAssociationMixin<Odd, number>;
    declare hasOdds: HasManyHasAssociationsMixin<Odd, number>;
    declare countOdds: HasManyCountAssociationsMixin;
    declare createOdd: HasManyCreateAssociationMixin<Odd, 'awayTeamId' | 'homeTeamId'>;

    // associated local model
    // none
}

Team.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    regionFull: new DataTypes.STRING(128),
    regionAbbr: new DataTypes.STRING(128),
    identifierFull: new DataTypes.STRING(128),
    identifierAbbr: new DataTypes.STRING(128),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'teams'
});