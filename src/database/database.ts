import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

import * as databaseModels from '../database/models';

export async function init(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful.');
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    
    // Exchange associations
    databaseModels.Exchange.belongsToMany(databaseModels.Game, {
        through: 'exchange_games',
        foreignKey: 'exchangeId',
        otherKey: 'gameId',
    });
    databaseModels.Exchange.hasMany(databaseModels.Odd, { foreignKey: 'exchangeId'} );
    
    // Game associations 
    databaseModels.Game.belongsToMany(databaseModels.Exchange, {
        through: 'exchange_games',
        foreignKey: 'gameId',
        otherKey: 'exchangeId',
    });
    databaseModels.Game.hasMany(databaseModels.Statistic, { foreignKey: 'gameId' });
    databaseModels.Game.belongsTo(databaseModels.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    databaseModels.Game.belongsTo(databaseModels.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    
    // Odd associations
    databaseModels.Odd.belongsTo(databaseModels.Exchange, { foreignKey: 'exchangeId' });
    databaseModels.Odd.belongsTo(databaseModels.Odd, { foreignKey: 'oppositeId' });
    databaseModels.Odd.belongsTo(databaseModels.Statistic, { foreignKey: 'statisticId' });

    // Statistic associations
    databaseModels.Statistic.belongsTo(databaseModels.Game, { foreignKey: 'gameId' });
    databaseModels.Statistic.hasMany(databaseModels.Odd, { foreignKey: 'statisticId' });

    // Team associations
    databaseModels.Team.hasMany(databaseModels.Game, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    databaseModels.Team.hasMany(databaseModels.Game, { as: 'homeTeam', foreignKey: 'homeTeamId' });

    await sequelize.sync({
        alter: true,
        logging: false,
    });
}

export async function close() {
    await sequelize.close();
}