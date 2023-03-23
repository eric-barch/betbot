"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSet = void 0;
class TeamSet extends Set {
    add(team) {
        return super.add(team);
    }
    getTeamByNameString({ string, }) {
        for (const team of this) {
            if (team.matchesByNameString({ string: string, })) {
                return team;
            }
        }
        throw new Error(`${this.constructor.name}.${this.getTeamByNameString.name} failed. Did not find team matching name string.`);
    }
}
exports.TeamSet = TeamSet;
//# sourceMappingURL=teamSet.js.map