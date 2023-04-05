import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('nba', 'root', 'f9R#@hY82l', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
});

import { Exchange, Game, Odd, Team } from '../database/models';

export async function init(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful.');
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    
    // Exchange associations
    Exchange.belongsToMany(Game, {
        through: 'exchange_games',
        foreignKey: 'exchangeId',
        otherKey: 'gameId',
    });
    Exchange.hasMany(Odd, { foreignKey: 'exchangeId'} );
    
    // Game associations 
    Game.belongsToMany(Exchange, {
        through: 'exchange_games',
        foreignKey: 'gameId',
        otherKey: 'exchangeId',
    });
    Game.hasMany(Odd, { foreignKey: 'gameId' });
    Game.belongsTo(Team, { as: 'gameAwayTeam', foreignKey: 'awayTeamId' });
    Game.belongsTo(Team, { as: 'gameHomeTeam', foreignKey: 'homeTeamId' });
    
    // Odd associations
    Odd.belongsTo(Exchange, { foreignKey: 'exchangeId' });
    Odd.belongsTo(Game, { foreignKey: 'gameId' });
    
    // Team associations
    Team.hasMany(Game, { as: 'gameAwayTeam', foreignKey: 'awayTeamId' });
    Team.hasMany(Game, { as: 'gameHomeTeam', foreignKey: 'homeTeamId' });

    await sequelize.sync({
        alter: true,
        logging: false,
    });
}

export async function close() {
    await sequelize.close();
}