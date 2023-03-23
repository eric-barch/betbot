import * as sequelize from 'sequelize';

import * as models from '..';
import { sequelizeInstance } from '../../database/instance';

const TeamSequelizeModel = sequelizeInstance.define('Team', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: sequelize.DataTypes.STRING,
    regionFull: sequelize.DataTypes.STRING,
    regionAbbr: sequelize.DataTypes.STRING,
    identifierFull: sequelize.DataTypes.STRING,
    identifierAbbr: sequelize.DataTypes.STRING,
});

export class TeamSequelizeInstance {
    private team: models.Team;
    private sequelizeInstance: void | sequelize.ModelCtor<sequelize.Model<any, any>> | null;

    constructor({
        team,
    }: {
        team: models.Team;
    }) {
        this.team = team;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        this.sequelizeInstance = await TeamSequelizeModel.findOrCreate({
            where: {
                fullName: this.getTeam().getRegionFullIdentifierFull(),
            },
            defaults: {
                fullName: this.getTeam().getRegionFullIdentifierFull(),
            },
        }).then(([team, created]) => {
            if (created) {
                console.log("Team created: ", team.get({ plain: true }));
            } else {
                console.log("Team already exists:", team.get({ plain: true }));
            }
        });
    }

    public getTeam() {
        return this.team;
    }

    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
}