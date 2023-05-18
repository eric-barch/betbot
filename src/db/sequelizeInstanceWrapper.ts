import { Sequelize } from 'sequelize';
import { sequelizeInstance } from './sequelizeInstance';
import {
    Exchange, League, Team, PageType, ExchangeLeague, ExchangeLeaguePage, Game 
} from './models';

class SequelizeInstanceWrapper {
    private wrappedInstance: Sequelize;

    constructor() {
        this.wrappedInstance = sequelizeInstance;
    }

    public async init(): Promise<void> {
        await this.connectToMySql();
        await this.associateModels();
        await this.wrappedInstance.sync({ alter: true });
        console.log(`Sequelize initiated successfully.`);
    }

    private async connectToMySql(): Promise<void> {
        await this.wrappedInstance.authenticate();
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

    get instance(): Sequelize {
        return this.wrappedInstance;
    }
}

export const sequelizeInstanceWrapper = new SequelizeInstanceWrapper();