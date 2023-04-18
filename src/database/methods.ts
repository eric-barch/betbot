import { sequelize } from './instance';

import { Exchange, Game, Odd, Outcome, Team } from './models';

export async function init(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful.');
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    
    // Exchange associations
    // Exchange.belongsToMany(Game, {
    //     through: 'exchange_games',
    //     foreignKey: 'exchangeId',
    //     otherKey: 'gameId',
    // });
    Exchange.hasMany(Odd, { foreignKey: 'exchangeId'});
    
    // Game associations 
    // Game.belongsToMany(Exchange, {
    //     through: 'exchange_games',
    //     foreignKey: 'gameId',
    //     otherKey: 'exchangeId',
    // });
    Game.hasMany(Outcome, { foreignKey: 'gameId' });
    Game.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Game.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    
    // Odd associations
    Odd.belongsTo(Exchange, { foreignKey: 'exchangeId' });
    Odd.belongsTo(Outcome, { foreignKey: 'outcomeId' });

    // Outcome associations
    Outcome.belongsTo(Game, { foreignKey: 'gameId' });
    Outcome.hasMany(Odd, { foreignKey: 'outcomeId' });

    // Team associations
    Team.hasMany(Game, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Team.hasMany(Game, { as: 'homeTeam', foreignKey: 'homeTeamId' });

    await sequelize.sync({
        alter: true,
        logging: false,
    });
}

export async function close() {
    await sequelize.close();
}