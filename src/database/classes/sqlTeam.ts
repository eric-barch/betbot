import * as sequelize from 'sequelize';
import * as database from '../../database';

export const SqlTeam = database.instance.define('Team', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

});
console.log(`Initialized and imported database.classes.SqlTeam.`);