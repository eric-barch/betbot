import * as sequelize from 'sequelize';

import * as models from '../../models';
import { sequelizeInstance } from '../instance';

export const GameSequelizeModel = sequelizeInstance.define('Game', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    awayTeamName: sequelize.DataTypes.STRING,
    homeTeamName: sequelize.DataTypes.STRING,
    startDate: sequelize.DataTypes.DATE,
});

export class GameSequelizeInstance {
    private game: models.Game;
    private sequelizeInstance: sequelize.Model<any, any> | null;

    constructor({
        game,
    }: {
        game: models.Game;
    }) {
        this.game = game;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        const game = this.getGame();

        const awayTeam = game.getAwayTeam();
        const homeTeam = game.getHomeTeam();
        const startDate = game.getStartDate();

        const awayTeamId = awayTeam.getSequelizeInstance()!.getSequelizeInstance()!.get('id');
        const homeTeamId = homeTeam.getSequelizeInstance()!.getSequelizeInstance()!.get('id');

        const awayTeamName = awayTeam.getRegionAbbrIdentifierAbbr();
        const homeTeamName = homeTeam.getRegionAbbrIdentifierAbbr();
        
        await GameSequelizeModel.findOrCreate({
            where: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                startDate: startDate,
            },
            defaults: {
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
                awayTeamName: awayTeamName,
                homeTeamName: homeTeamName,
                startDate: startDate,
            },
        }).then(([sqlGame, created]) => {
            if (created) {
                console.log(`Game created: ${game.getName()}`);
            } else {
                console.log(`Game already exists in MySQL: ${game.getName()}`);
            }
            this.sequelizeInstance = sqlGame;
        });
    }

    public getGame() {
        return this.game;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}