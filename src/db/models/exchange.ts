import * as s from 'sequelize';

import { sequelizeInstance } from '../sequelize-instance';
import { League } from './league';
import { ExchangeLeague } from './exchange-league';

export class Exchange extends s.Model<
    s.InferAttributes<Exchange, { omit: 'leagues' }>,
    s.InferCreationAttributes<Exchange, { omit: 'leagues' }>
> {
    declare id: s.CreationOptional<number>;
    declare name: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
    declare leagues: s.NonAttribute<League[]>;

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
}

Exchange.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize: sequelizeInstance,
    tableName: 'Exchanges',
})