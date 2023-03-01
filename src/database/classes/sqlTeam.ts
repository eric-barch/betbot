import * as sequelize from 'sequelize';
import * as database from '../../database';

const exportVerbosity = false;
const exportVerbosityBase = 'database.classes';

export const SqlTeam = database.instance.define('SqlTeam', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

});
exportVerbosity ? console.log(`Exported ${exportVerbosityBase}.${SqlTeam.name}.`) : null;