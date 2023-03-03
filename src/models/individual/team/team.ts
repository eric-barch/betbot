export class Team {
    private fullName: string;
    private regionFull: string;
    private regionAbbr: string;
    private identifierFull: string;
    private identifierAbbr: string;
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
        this.regionFull = regionFullName;
        this.regionAbbr = regionAbbreviation;
        this.identifierFull = teamFullName;
        this.identifierAbbr = teamAbbreviation;
        this.altNames = altNames;
    }

    // Public methods
    public match({
        string,
    }: {
        string: string,
    }) {
        if (
            string === this.getFullName() ||
            string === this.getRegionAbbrIdentifierFull()
        ) {
            return true;
        } else {
            return false;
        }
    }

    // Getters
    public getFullName() {
        return this.fullName;
    }
    
    public getRegionFull() {
        return this.regionFull;
    }

    public getRegionAbbr() {
        return this.regionAbbr;
    }

    public getIdentifierFull() {
        return this.identifierFull;
    }

    public getIdentifierAbbr() {
        return this.identifierAbbr;
    }

    public getAltNames() {
        return this.altNames;
    }

    public getRegionAbbrIdentifierFull() {
        const str = this.getRegionAbbr() + ' ' + this.getIdentifierFull();
        return str;
    }
}