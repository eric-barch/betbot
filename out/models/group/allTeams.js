"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllTeams = void 0;
class AllTeams {
    constructor({ teams, } = {}) {
        if (teams) {
            this.teams = teams;
        }
        else {
            this.teams = [];
        }
    }
    getTeam({ string, }) {
        for (const team of this.teams) {
            if (team.match({
                string: string,
            })) {
                return team;
            }
        }
        return this.teams[0];
    }
    setTeams({ teams, }) {
        this.teams = teams;
    }
}
exports.AllTeams = AllTeams;
//# sourceMappingURL=allTeams.js.map