import * as s from 'sequelize';

import { sequelizeInstance } from './instance';
import {
    Exchange, League, Team, PageType, ExchangeLeague, ExchangeLeaguePageType, Game 
} from '../models';

class SequelizeInstanceWrapper {
    private wrappedInstance: s.Sequelize;

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

        // League associations
        League.belongsToMany(Exchange, {through: ExchangeLeague, foreignKey: 'leagueId' });
        League.hasMany(Team, { foreignKey: 'leagueId' });

        // ExchangeLeague associations
        ExchangeLeague.belongsToMany(PageType, { through: ExchangeLeaguePageType, foreignKey: 'exchangeLeagueId' });

        // PageType associations
        PageType.belongsToMany(ExchangeLeague, { through: ExchangeLeaguePageType, foreignKey: 'pageTypeId' });

        // Team associations
        Team.belongsTo(League, { foreignKey: 'leagueId' });

        // Game associations
        Game.belongsTo(Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
        Game.belongsTo(Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    }

    get instance(): s.Sequelize {
        return this.wrappedInstance;
    }
}

export const sequelizeInstanceWrapper = new SequelizeInstanceWrapper();