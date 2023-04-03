"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSet = void 0;
class TeamSet extends Set {
    getTeamByNameString({ nameString, }) {
        for (const team of this) {
            if (team.matchesByNameString({ nameString: nameString, })) {
                return team;
            }
        }
        throw new Error(`Did not find team matching name string ${this.constructor.name}.${this.getTeamByNameString.name}.`);
    }
}
exports.TeamSet = TeamSet;
//# sourceMappingURL=teamSet.js.map