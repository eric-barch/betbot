import * as sequelize from 'sequelize';
import * as database from '../../database';

const exportVerbosity = false;
const exportVerbosityBase = 'database.classes';

export const SqlExchange = database.instance.define('SqlExchange', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
});
exportVerbosity ? console.log(`\nExported ${exportVerbosityBase}.${SqlExchange.name}.`) : null;