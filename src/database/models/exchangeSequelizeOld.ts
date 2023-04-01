import * as sequelize from 'sequelize';

import * as models from '../../models';

export class SequelizeExchange extends sequelize.Model {
    public localExchange: models.Exchange;

    public getLocalExchange() {
        return this.localExchange;
    }
}

SequelizeExchange.init({
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
}, { 
    sequelize,
    modelName: 'Exchange',
});





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
    private sequelizeInstance: sequelize.Model<any, any> | null;

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

        await SequelizeExchange.findOrCreate({
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
            this.sequelizeInstance = sqlExchange;
        });
    }

    public getExchange() {
        return this.exchange;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}