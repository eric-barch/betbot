import * as s from 'sequelize';

import { sequelize } from './instance';

import * as models from '../models';

class SequelizeInstanceWrapper {
    private wrappedInstance: s.Sequelize;

    constructor() {
        this.wrappedInstance = sequelize;
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

        // Team associations
        models.Team.belongsTo(models.League, { foreignKey: 'leagueId' });

        // PageType associations
        models.PageType.belongsToMany(models.ExchangeLeague, { through: models.ExchangeLeaguePageType, foreignKey: 'pageTypeId' });

        // ExchangeLeague associations
        models.ExchangeLeague.belongsTo(models.Exchange, { foreignKey: 'exchangeId' });
        models.ExchangeLeague.belongsTo(models.League, { foreignKey: 'leagueId' });
        models.ExchangeLeague.belongsToMany(models.PageType, { through: models.ExchangeLeaguePageType, foreignKey: 'exchangeLeagueId' });

        // ExchangeLeaguePageType associations
        models.ExchangeLeaguePageType.belongsTo(models.ExchangeLeague, { foreignKey: 'exchangeLeagueId' });
        models.ExchangeLeaguePageType.belongsTo(models.PageType, { foreignKey: 'pageTypeId' });

        // Game associations
        models.Game.belongsTo(models.Team, { as: 'awayTeam', foreignKey: 'awayTeamId' });
        models.Game.belongsTo(models.Team, { as: 'homeTeam', foreignKey: 'homeTeamId' });
    }

    get instance(): s.Sequelize {
        return this.wrappedInstance;
    }
}

export const sequelizeInstance = new SequelizeInstanceWrapper();