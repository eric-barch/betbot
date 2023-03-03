import * as models from '..';

export class AllTeams {
    private teams: Array<models.Team>;

    constructor({
        teams,
    }: {
        teams?: Array<models.Team>,
    } = {}) {
        if (teams) {
            this.teams = teams;
        } else {
            this.teams = [];
        }
    }

    public getTeam({
        string,
    }: {
        string: string,
    }) {
        for (const team of this.teams) {
            if (team.match({
                string: string,
            })) {
                return team;
            }
        }
        return this.teams[0];
    }

    public setTeams({
        teams,
    }: {
        teams: Array<models.Team>,
    }) {
        this.teams = teams;
    }

}