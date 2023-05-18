import { Sequelize } from 'sequelize';
import {
    Exchange, League, Team, PageType, ExchangeLeague, ExchangeLeaguePage, Game 
} from './models';

export class SequelizeInstance {
    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(
            'betbot',
            'root',
            'f9R#@hY82l',
            {
                host: 'localhost',
                port: 3306,
                dialect: 'mysql',
                logging: false,
            }
        )
    }

    public async init(): Promise<void> {
        await this.connectToMySql();
        await this.associateModels();
        await this.sequelize.sync({ alter: true });
        console.log(`Sequelize initiated successfully.`);
    }

    private async connectToMySql(): Promise<void> {
        await this.sequelize.authenticate();
    }

    private async associateModels(): Promise<void> {
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
    }
}