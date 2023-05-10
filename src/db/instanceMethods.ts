import { sequelize } from './instance';
import { Exchange } from './exchange';
import { League } from './league';
import { Team } from './team';
import { PageType } from './pageType';
import { ExchangeLeague } from './exchangeLeague';
import { ExchangeLeaguePage } from './exchangeLeaguePage';
import { Game } from './game';

export async function init(): Promise<void> {
    await initDbConnection();

    // Exchange associations
    Exchange.belongsToMany(League, { through: ExchangeLeague, foreignKey: 'exchangeId' });
    Exchange.hasMany(ExchangeLeague, { foreignKey: 'exchangeId' });

    // League associations
    League.belongsToMany(Exchange, {through: ExchangeLeague, foreignKey: 'leagueId' });
    League.hasMany(Team, { foreignKey: 'leagueId' });
    League.hasMany(ExchangeLeague, { foreignKey: 'leagueId' });

    // ExchangeLeague associations
    ExchangeLeague.belongsTo(Exchange, { foreignKey: 'exchangeId' });
    ExchangeLeague.belongsTo(League, { foreignKey: 'leagueId' });
    ExchangeLeague.hasMany(ExchangeLeaguePage, { foreignKey: 'exchangeLeagueId' });

    // ExchangeLeaguePage associations
    ExchangeLeaguePage.belongsTo(ExchangeLeague, { foreignKey: 'exchangeLeagueId' });
    ExchangeLeaguePage.belongsTo(PageType, { foreignKey: 'pageTypeId' });

    // Team associations
    Team.belongsTo(League, { foreignKey: 'leagueId' });

    // Game associations
    Game.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
    Game.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });

    await sequelize.sync({
        force: true,
        logging: false,
    });
    console.log(`MySQL tables set up successfully.`);
}

async function initDbConnection(): Promise<void> {
    await sequelize.authenticate();
    console.log(`\nMySQL connection established successfully.`);
}

export async function close(): Promise<void> {
    await sequelize.close();
    console.log(`\nMySQL connection closed successfully.\n`)
}