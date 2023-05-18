import * as s from 'sequelize';

import { sequelizeInstance } from '../sequelizeInstance/instance';

export class PageType extends s.Model<
    s.InferAttributes<PageType>,
    s.InferCreationAttributes<PageType>
> {
    declare id: s.CreationOptional<number>;
    declare name: string;
    declare createdAt: s.CreationOptional<Date>;
    declare updatedAt: s.CreationOptional<Date>;
}

PageType.init({
    id: {
        type: s.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: new s.DataTypes.STRING(128),
    createdAt: s.DataTypes.DATE,
    updatedAt: s.DataTypes.DATE,
}, {
    sequelize: sequelizeInstance,
    tableName: 'PageTypes',
})