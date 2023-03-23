import * as sequelize from 'sequelize';

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

import * as models from '..';

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
        this.sequelizeInstance = await ExchangeSequelizeModel.findOrCreate({
            where: {
                name: this.exchange.getName(),
            },
            defaults: {
                name: this.getExchange().getName(),
                url: this.getExchange().getUrl(),
            },
        }).then(([exchange, created]) => {
            if (created) {
                console.log("Exchange created: ", exchange.get({ plain: true }));
            } else {
                console.log("Exchange already exists:", exchange.get({ plain: true }));
                const rowData = exchange.get({ plain: true });
                if (rowData.url !== this.getExchange().getUrl()) {
                    ExchangeSequelizeModel.update(
                        { url: this.getExchange().getUrl() },
                        { where: {
                            name: this.getExchange().getName(),
                        }}
                    ).then(() => {
                        console.log(`Database URL updated to match program URL.`);
                    });
                } else {
                    console.log(`Database URL matches program URL. No update necessary.`);
                }
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