import * as models from '../../models';

export class AllTeams {
    private teams: Array<models.Team>;

    constructor({
        teams,
        verbose = false,
    }: {
        teams?: Array<models.Team>,
        verbose?: boolean,
    } = {}) {
        if (teams) {
            this.teams = teams;
        } else {
            this.teams = [];
        }
    }

    public getTeam({
        string,
        verbose = false,
    }: {
        string: string,
        verbose?: boolean,
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
        verbose = false,
    }: {
        teams: Array<models.Team>,
        verbose?: boolean,
    }) {
        this.teams = teams;
    }

}