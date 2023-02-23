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
    match({ string, verbose = false, }) {
        if (string === this.getFullName() ||
            string === this.getRegionAbbrIdentifierFull()) {
            return true;
        }
        else {
            return false;
        }
    }
    // Getters
    getFullName({ verbose = false, } = {}) {
        return this.fullName;
    }
    getRegionFull({ verbose = false, } = {}) {
        return this.regionFull;
    }
    getRegionAbbr({ verbose = false, } = {}) {
        return this.regionAbbr;
    }
    getIdentifierFull({ verbose = false, } = {}) {
        return this.identifierFull;
    }
    getIdentifierAbbr({ verbose = false, } = {}) {
        return this.identifierAbbr;
    }
    getAltNames({ verbose = false, }) {
        return this.altNames;
    }
    getRegionAbbrIdentifierFull({ verbose = false, } = {}) {
        const str = this.getRegionAbbr() + ' ' + this.getIdentifierFull();
        return str;
    }
}
exports.Team = Team;
