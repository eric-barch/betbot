"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
class Team {
    constructor({ fullName, regionFullName, regionAbbreviation, teamFullName, teamAbbreviation, altNames, }) {
        this.fullName = fullName;
        this.regionFull = regionFullName;
        this.regionAbbr = regionAbbreviation;
        this.identifierFull = teamFullName;
        this.identifierAbbr = teamAbbreviation;
        this.altNames = altNames;
    }
    // Public methods
    match({ string, }) {
        if (string === this.getFullName() ||
            string === this.getRegionAbbrIdentifierFull()) {
            return true;
        }
        else {
            return false;
        }
    }
    // Getters
    getFullName() {
        return this.fullName;
    }
    getRegionFull() {
        return this.regionFull;
    }
    getRegionAbbr() {
        return this.regionAbbr;
    }
    getIdentifierFull() {
        return this.identifierFull;
    }
    getIdentifierAbbr() {
        return this.identifierAbbr;
    }
    getAltNames() {
        return this.altNames;
    }
    getRegionAbbrIdentifierFull() {
        const str = this.getRegionAbbr() + ' ' + this.getIdentifierFull();
        return str;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map