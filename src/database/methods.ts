import { sequelize } from './instance';

import { Exchange, Game, Odd, OldOdd, Outcome, Team } from './models';

export async function init(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful.');
    } catch (error) {
        console.log(`MySQL connection unsuccessful: ${error}`);
    }
    
    // Exchange associations
    Exchange.hasMany(Odd, { foreignKey: 'exchangeId'});
    
    // Game associations 
    Game.hasMany(Outcome, { foreignKey: 'gameId' });
    Game.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Game.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    
    // Odd associations
    Odd.hasMany(OldOdd, { foreignKey: 'oddId' });
    Odd.belongsTo(Exchange, { foreignKey: 'exchangeId' });
    Odd.belongsTo(Outcome, { foreignKey: 'outcomeId' });
    
    // OldOdd associations
    OldOdd.belongsTo(Odd, { foreignKey: 'oddId' });

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