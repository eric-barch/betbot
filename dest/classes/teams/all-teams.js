"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTeams = void 0;
class AllTeams {
    constructor({ teams, verbose = false, } = {}) {
        if (teams) {
            this.teams = teams;
        }
        else {
            this.teams = [];
        }
    }
    getTeam({ string, verbose = false, }) {
        for (const team of this.teams) {
            if (team.match({
                string: string,
            })) {
                return team;
            }
        }
        return this.teams[0];
    }
    setTeams({ teams, verbose = false, }) {
        this.teams = teams;
    }
}
exports.AllTeams = AllTeams;
