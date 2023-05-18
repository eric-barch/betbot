import * as s from 'sequelize';

import { sequelizeInstance } from '../sequelizeInstance';
import { Exchange } from './exchange';
import { League } from './league';

export class ExchangeLeague extends s.Model<
    s.InferAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>,
    s.InferCreationAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>
> {
    declare id: s.CreationOptional<number>;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchangeId: s.ForeignKey<Exchange['id']>;
    declare leagueId: s.ForeignKey<League['id']>;
    declare exchange: s.NonAttribute<Exchange>;
    declare league: s.NonAttribute<League>;

    // belongsTo(Exchange)
    declare createExchange: s.BelongsToCreateAssociationMixin<Exchange>;
    declare getExchange: s.BelongsToGetAssociationMixin<Exchange>;
    declare setExchange: s.BelongsToSetAssociationMixin<Exchange, number>;

    // belongsTo(League)
    declare createLeague: s.BelongsToCreateAssociationMixin<League>;
    declare getLeague: s.BelongsToGetAssociationMixin<League>;
    declare setLeague: s.BelongsToSetAssociationMixin<League, number>;
}

ExchangeLeague.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize: sequelizeInstance,
    tableName: 'ExchangeLeagues',
});