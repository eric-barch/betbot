import * as sequelize from 'sequelize';

import * as models from '../../models';
import { sequelizeInstance } from '../../database/instance';

export const ExchangeSequelizeModel = sequelizeInstance.define('Exchange', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
});

export class ExchangeSequelizeInstance {
    private exchange: models.Exchange;
    private sequelizeInstance: void | sequelize.ModelCtor<sequelize.Model<any, any>> | null;

    constructor({
        exchange,
    }: {
        exchange: models.Exchange;
    }) {
        this.exchange = exchange;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        const localExchange = this.getExchange();

        this.sequelizeInstance = await ExchangeSequelizeModel.findOrCreate({
            where: {
                name: localExchange.getName(),
            },
            defaults: {
                name: localExchange.getName(),
                url: localExchange.getUrl(),
            },
        }).then(async ([sqlExchange, created]) => {
            if (created) {
                console.log(`Exchange created in MySQL: ${localExchange.getName()}`);
            } else {
                console.log(`Exchange already exists in MySQL: ${localExchange.getName()}`);
                await sqlExchange.update({
                    url: localExchange.getUrl(),
                });
            }
        });
    }

    public getExchange() {
        return this.exchange;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}