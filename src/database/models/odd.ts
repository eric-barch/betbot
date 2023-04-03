import {
    Association,
    BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin,
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes, InferCreationAttributes,
    Model,
    NonAttribute,
} from 'sequelize';

import { sequelize } from '../database';

import { Exchange } from './exchange';
import { Game } from './game';
import { Team } from './team';

export class Odd extends Model<
    InferAttributes<Odd, {omit: 'exchange' | 'game' | 'awayTeam' | 'homeTeam'}>,
    InferCreationAttributes<Odd, {omit: 'exchange' | 'game' | 'awayTeam' | 'homeTeam'}>
> {
    // id
    declare id: CreationOptional<number>;

    // column headers
    declare spreadAwaySpread: number | null;
    declare spreadHomeSpread: number | null;
    declare spreadAwayPrice: number | null;
    declare spreadHomePrice: number | null;
    declare moneyAwayPrice: number | null;
    declare moneyHomePrice: number | null;
    declare totalTotal: number | null;
    declare totalOverPrice: number | null;
    declare totalUnderPrice: number | null;

    // timestamps
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    // foreign keys
    declare exchangeId: ForeignKey<Exchange['id']>;
    declare gameId: ForeignKey<Game['id']>;
    declare awayTeamId: ForeignKey<Team['id']>;
    declare homeTeamId: ForeignKey<Team['id']>;

    // associated sequelize model(s)
    declare exchange?: NonAttribute<Exchange>;
    declare game?: NonAttribute<Game>;
    declare awayTeam?: NonAttribute<Team>;
    declare homeTeam?: NonAttribute<Team>;

    // virtual model associations
    // belongsTo(Exchange)
    declare createExchange: BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: BelongsToSetAssociationMixin<Exchange, number>;

    // belongsTo(Game)
    declare createGame: BelongsToCreateAssociationMixin<Game>;
    declare getGame: BelongsToGetAssociationMixin<Game>;
    declare setGame: BelongsToSetAssociationMixin<Game, number>;

    // belongsTo(Team)
    declare createTeam: BelongsToCreateAssociationMixin<Team>;
    declare getTeam: BelongsToGetAssociationMixin<Team>;
    declare setTeam: BelongsToSetAssociationMixin<Team, number>;

    // associated local model
    // none
}

Odd.init({
    id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
    },
    spreadAwaySpread: DataTypes.FLOAT,
    spreadHomeSpread: DataTypes.FLOAT,
    spreadAwayPrice: DataTypes.INTEGER,
    spreadHomePrice: DataTypes.INTEGER,
    moneyAwayPrice: DataTypes.INTEGER,
    moneyHomePrice: DataTypes.INTEGER,
    totalTotal: DataTypes.FLOAT,
    totalOverPrice: DataTypes.INTEGER,
    totalUnderPrice: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'odds',
});