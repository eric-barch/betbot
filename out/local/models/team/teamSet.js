"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamSet = void 0;
class TeamSet extends Set {
    find({ name, }) {
        for (const team of this) {
            if (team.matches({ name: name })) {
                return team;
            }
        }
        throw new Error(`Did not find team matching name string ${this.constructor.name}.${this.find.name}.`);
    }
}
exports.TeamSet = TeamSet;
//# sourceMappingURL=teamSet.js.map