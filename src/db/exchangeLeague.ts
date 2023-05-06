import * as s from 'sequelize';

import { sequelize } from './instance';
import { Exchange } from './exchange';
import { League } from './league';

export class ExchangeLeague extends s.Model<
    s.InferAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>,
    s.InferCreationAttributes<ExchangeLeague, { omit: 'exchange' | 'league' }>
> {
    declare urlExtension: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare exchangeId: s.ForeignKey<Exchange['id']>;
    declare leagueId: s.ForeignKey<League['id']>;
    declare exchange?: s.NonAttribute<Exchange>;
    declare league?: s.NonAttribute<League>;
}

ExchangeLeague.init({
    urlExtension: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize,
    tableName: 'ExchangeLeagues',
})