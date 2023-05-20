import * as s from 'sequelize';

import { sequelizeInstance } from './instance';

import * as models from '../models';

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
        models.Exchange.belongsToMany(models.League, { through: models.ExchangeLeague, foreignKey: 'exchangeId' });

        // League associations
        models.League.belongsToMany(models.Exchange, {through: models.ExchangeLeague, foreignKey: 'leagueId' });
        models.League.hasMany(models.Team, { foreignKey: 'leagueId' });

        // ExchangeLeague associations
        models.ExchangeLeague.belongsToMany(models.PageType, { through: models.ExchangeLeaguePage, foreignKey: 'exchangeLeagueId' });

        // PageType associations
        models.PageType.belongsToMany(models.ExchangeLeague, { through: models.ExchangeLeaguePage, foreignKey: 'pageTypeId' });

        // Team associations
        models.Team.belongsTo(models.League, { foreignKey: 'leagueId' });

        // Game associations
        models.Game.belongsTo(models.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
        models.Game.belongsTo(models.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    }

    get instance(): s.Sequelize {
        return this.wrappedInstance;
    }
}

export const sequelizeInstanceWrapper = new SequelizeInstanceWrapper();