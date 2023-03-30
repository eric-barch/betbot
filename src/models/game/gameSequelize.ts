import * as sequelize from 'sequelize';

import * as models from '../../models';
import { sequelizeInstance } from '../../database/instance';

export const GameSequelizeModel = sequelizeInstance.define('Game', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeam: sequelize.DataTypes.STRING,
    homeTeam: sequelize.DataTypes.STRING,
    startDate: sequelize.DataTypes.DATE
});

export class GameSequelizeInstance {
    private game: models.Game;
    private sequelizeInstance: void | sequelize.ModelCtor<sequelize.Model<any, any>> | null;

    constructor({
        game,
    }: {
        game: models.Game;
    }) {
        this.game = game;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        this.sequelizeInstance = await GameSequelizeModel.findOrCreate({
            where: {
                awayTeam: this.getGame().getAwayTeam(),
                homeTeam: this.getGame().getHomeTeam(),
                startDate: this.getGame().getStartDate(),
            },
            defaults: {
                awayTeam: this.getGame().getAwayTeam(),
                homeTeam: this.getGame().getHomeTeam(),
                startDate: this.getGame().getStartDate(),
            },
        }).then(([game, created]) => {
            if (created) {
                console.log("Game created: ", game.get({ plain: true }));
            } else {
                console.log("Game already exists:", game.get({ plain: true }));
            }
        });
    }

    public getGame() {
        return this.game;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}