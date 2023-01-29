export class Team {
    private fullName: string;
    private regionFullName: string;
    private regionAbbreviation: string;
    private teamFullName: string;
    private teamAbbreviation: string;
    private altNames: Array<string>;

    constructor({
        fullName,
        regionFullName,
        regionAbbreviation,
        teamFullName,
        teamAbbreviation,
        altNames,
    }: {
        fullName: string,
        regionFullName: string,
        regionAbbreviation: string,
        teamFullName: string,
        teamAbbreviation: string,
        altNames: Array<string>,
    }) {
        this.fullName = fullName;
        this.regionFullName = regionFullName;
        this.regionAbbreviation = regionAbbreviation;
        this.teamFullName = teamFullName;
        this.teamAbbreviation = teamAbbreviation;
        this.altNames = altNames;
    }
}

export let teams = new Map<string, Team>([
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