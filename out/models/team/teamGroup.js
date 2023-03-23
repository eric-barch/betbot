"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamGroup = void 0;
class TeamGroup extends Set {
    getTeamByNameString({ string, }) {
        for (const team of this) {
            if (team.matchesByNameString({ string: string, })) {
                return team;
            }
        }
        throw new Error(`${this.constructor.name}.${this.getTeamByNameString.name} failed. Did not find team matching name string.`);
    }
}
exports.TeamGroup = TeamGroup;
//# sourceMappingURL=teamGroup.js.map