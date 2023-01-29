"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teams = exports.Team = void 0;
class Team {
    constructor({ fullName, regionFullName, regionAbbreviation, teamFullName, teamAbbreviation, altNames, }) {
        this.fullName = fullName;
        this.regionFullName = regionFullName;
        this.regionAbbreviation = regionAbbreviation;
        this.teamFullName = teamFullName;
        this.teamAbbreviation = teamAbbreviation;
        this.altNames = altNames;
    }
}
exports.Team = Team;
exports.teams = new Map([
    ['Arizona Cardinals', new Team({
            fullName: 'Arizona Cardinals',
            regionFullName: 'Arizona',
            regionAbbreviation: 'ARI',
            teamFullName: 'Cardinals',
            teamAbbreviation: 'Cards',
            altNames: [],
        })],
    ['Atlanta Falcons', new Team({
            fullName: 'Atlanta Falcons',
            regionFullName: 'Atlanta',
            regionAbbreviation: 'ATL',
            teamFullName: 'Falcons',
            teamAbbreviation: 'Falcs',
            altNames: [],
        })],
    ['Baltimore Ravens', new Team({
            fullName: 'Baltimore Ravens',
            regionFullName: 'Baltimore',
            regionAbbreviation: 'BAL',
            teamFullName: 'Ravens',
            teamAbbreviation: 'Raves',
            altNames: [],
        })],
    ['Buffalo Bills', new Team({
            fullName: 'Buffalo Bills',
            regionFullName: 'Buffalo',
            regionAbbreviation: 'BUF',
            teamFullName: 'Bills',
            teamAbbreviation: 'Bills',
            altNames: [],
        })],
]);
