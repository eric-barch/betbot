import * as s from 'sequelize';

import { sequelize } from '../instance';
import * as db from '../../db';

export class ExchangeLeague extends s.Model<
    s.InferAttributes<ExchangeLeague, { omit: 'exchange' | 'league'}>,
    s.InferCreationAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>
> {
    declare id: s.CreationOptional<number>;
    declare urlExtension: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchangeId: s.ForeignKey<db.Exchange['id']>;
    declare leagueId: s.ForeignKey<db.League['id']>;
    declare exchange?: s.NonAttribute<db.Exchange>;
    declare league?: s.NonAttribute<db.League>;

    // belongsTo(Exchange)
    declare createExchange: s.BelongsToCreateAssociationMixin<db.Exchange>;
    declare getExchange: s.BelongsToGetAssociationMixin<db.Exchange>;
    declare setExchange: s.BelongsToSetAssociationMixin<db.Exchange, number>;

    // belongsTo(League)
    declare createLeague: s.BelongsToCreateAssociationMixin<db.League>;
    declare getLeague: s.BelongsToGetAssociationMixin<db.League>;
    declare setLeague: s.BelongsToSetAssociationMixin<db.League, number>;
}

ExchangeLeague.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    urlExtension: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'ExchangeLeagues',
})