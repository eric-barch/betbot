import * as sequelize from 'sequelize';

import * as models from '../../models';
import { sequelizeInstance } from '../instance';

const TeamSequelizeModel = sequelizeInstance.define('Team', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
        const localTeam = this.getTeam();

        this.sequelizeInstance = await TeamSequelizeModel.findOrCreate({
            where: {
                regionFull: localTeam.getRegionFull(),
                identifierFull: localTeam.getIdentifierFull(),
            },
            defaults: {
                regionFull: localTeam.getRegionFull(),
                regionAbbr: localTeam.getRegionAbbr(),
                identifierFull: localTeam.getIdentifierFull(),
                identifierAbbr: localTeam.getIdentifierAbbr(),
            },
        }).then(async ([sqlTeam, created]) => {
            if (created) {
                console.log(`Team created in MySQL: ${localTeam.getRegionFullIdentifierFull()}`);
            } else {
                console.log(`Team already exists in MySQL: ${localTeam.getRegionFullIdentifierFull()}`);
                await sqlTeam.update({
                    regionAbbr: localTeam.getRegionAbbr(),
                    identifierAbbr: localTeam.getIdentifierAbbr(),
                });
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