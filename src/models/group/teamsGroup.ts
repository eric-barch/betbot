import * as initData from '../../initData';
import * as models from '..';

export class TeamsGroup {
    private teamsArray: Array<models.Team>;

    constructor({
        teams,
    }: {
        teams?: Array<models.Team>,
    } = {}) {
        if (teams) {
            this.teamsArray = teams;
        } else {
            this.teamsArray = initData.nbaTeams;
        }
    }

    public getTeam({
        string,
    }: {
        string: string,
    }) {
        for (const team of this.teamsArray) {
            if (team.match({
                string: string,
            })) {
                return team;
            }
        }
        return this.teamsArray[0];
    }

    public setTeams({
        teams,
    }: {
        teams: Array<models.Team>,
    }) {
        this.teamsArray = teams;
    }

}