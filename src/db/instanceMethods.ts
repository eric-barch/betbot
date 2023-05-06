import { sequelize } from './instance';
import { Exchange } from './exchange';
import { League } from './league';
import { Team } from './team';
import { ExchangeLeague } from './exchangeLeague';

export async function init(): Promise<void> {
    await initDbConnection();

    // Exchange associations
    Exchange.belongsToMany(League, { through: ExchangeLeague, foreignKey: 'exchangeId' });
    Exchange.hasMany(ExchangeLeague, { foreignKey: 'exchangeId' });

    // League associations
    League.belongsToMany(Exchange, {through: ExchangeLeague, foreignKey: 'leagueId' });
    League.hasMany(Team, { foreignKey: 'leagueId' });
    League.hasMany(ExchangeLeague, { foreignKey: 'leagueId' });

    // Team associations
    Team.belongsTo(League, { foreignKey: 'leagueId' });

    // ExchangeLeague associations
    ExchangeLeague.belongsTo(Exchange, { foreignKey: 'exchangeId' });
    ExchangeLeague.belongsTo(League, { foreignKey: 'leagueId' });

    await sequelize.sync({
        alter: true,
        logging: false,
    });
    console.log(`MySQL table setup successful.`);
}

async function initDbConnection(): Promise<void> {
    await sequelize.authenticate();
    console.log(`MySQL connection established successfully.`);
}

export async function close(): Promise<void> {
    await sequelize.close();
    console.log(`MySQL connection closed successfully.`)
}