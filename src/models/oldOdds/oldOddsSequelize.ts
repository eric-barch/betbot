import * as sequelize from 'sequelize';

import * as models from '..';
import { sequelizeInstance } from '../../database/instance';

export const oldOddsSequelizeModel = sequelizeInstance.define('OldOdds', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    spreadAwaySpread: sequelize.DataTypes.FLOAT,
    spreadHomeSpread: sequelize.DataTypes.FLOAT,
    spreadAwayPrice: sequelize.DataTypes.INTEGER,
    spreadHomePrice: sequelize.DataTypes.INTEGER,
    moneyAwayPrice: sequelize.DataTypes.INTEGER,
    moneyHomePrice: sequelize.DataTypes.INTEGER,
    overUnderOverUnder: sequelize.DataTypes.FLOAT,
    overUnderOverPrice: sequelize.DataTypes.INTEGER,
    overUnderUnderPrice: sequelize.DataTypes.INTEGER,
    scrapedAt: sequelize.DataTypes.DATE(3),
    savedToDatabaseAt: sequelize.DataTypes.DATE(3),
});

export class oldOddsSequelizeInstance {
    private odds: models.Odds;
    private sequelizeInstance: void | sequelize.ModelCtor<sequelize.Model<any, any>> | null;

    constructor({
        odds,
    }: {
        odds: models.Odds;
    }) {
        this.odds = odds;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        this.sequelizeInstance = await oldOddsSequelizeModel.findOrCreate({
            where: {
                gameId: this.getOdds().getGame().getSequelizeInstance()?.getSequelizeInstance(),
                exchangeId: this.getOdds().getExchange()?.getSequelizeInstance()?.getSequelizeInstance(),
            },
            defaults: {
                gameId: this.getOdds().getGame().getSequelizeInstance()?.getSequelizeInstance(),
                exchangeId: this.getOdds().getExchange()?.getSequelizeInstance()?.getSequelizeInstance(),
            },
        }).then(([odds, created]) => {
            if (created) {
                console.log("Odds created: ", odds.get({ plain: true }));
            } else {
                console.log("Odds already exist:", odds.get({ plain: true }));
            }
        });
    }

    public getOdds() {
        return this.odds;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }

}