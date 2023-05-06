import { sequelize } from './instance';
import * as db from '../db';

export async function init(): Promise<void> {
    await initDbConnection();

    // Exchange associations
    db.Exchange.belongsToMany(db.League, { through: db.ExchangeLeague, foreignKey: 'exchangeId' });
    db.Exchange.hasMany(db.ExchangeLeague, { foreignKey: 'exchangeId' });

    // League associations
    db.League.belongsToMany(db.Exchange, {through: db.ExchangeLeague, foreignKey: 'leagueId' });
    db.League.hasMany(db.Team, { foreignKey: 'leagueId' });
    db.League.hasMany(db.ExchangeLeague, { foreignKey: 'leagueId' });

    // ExchangeLeague associations
    db.ExchangeLeague.belongsTo(db.Exchange, { foreignKey: 'exchangeId' });
    db.ExchangeLeague.belongsTo(db.League, { foreignKey: 'leagueId' });
    db.ExchangeLeague.hasMany(db.ExchangeLeaguePage, { foreignKey: 'exchangeLeagueId' });

    // ExchangeLeaguePage associations
    db.ExchangeLeaguePage.belongsTo(db.ExchangeLeague, { foreignKey: 'exchangeLeagueId' });

    // Team associations
    db.Team.belongsTo(db.League, { foreignKey: 'leagueId' });

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