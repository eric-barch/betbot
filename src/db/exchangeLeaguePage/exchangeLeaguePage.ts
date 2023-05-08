import * as s from 'sequelize';

import { sequelize } from '../instance';
import * as db from '../../db';

export class ExchangeLeaguePage extends s.Model<
    s.InferAttributes<ExchangeLeaguePage, { omit: 'exchangeLeague' }>,
    s.InferCreationAttributes<ExchangeLeaguePage, { omit: 'exchangeLeague' }>
> {
    declare id: s.CreationOptional<number>;
    declare pageName: string;
    declare urlExtension: string | null;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchangeLeagueId: s.ForeignKey<db.ExchangeLeague['id']>;
    declare exchangeLeague?: s.NonAttribute<db.ExchangeLeague>;

    // belongsTo(ExchangeLeague)
    declare createExchangeLeague: s.BelongsToCreateAssociationMixin<db.ExchangeLeague>;
    declare getExchangeLeague: s.BelongsToGetAssociationMixin<db.ExchangeLeague>;
    declare setExchangeLeague: s.BelongsToSetAssociationMixin<db.ExchangeLeague, number>;
}

ExchangeLeaguePage.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    pageName: new s.DataTypes.STRING(128),
    urlExtension: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'ExchangeLeaguePages',
})