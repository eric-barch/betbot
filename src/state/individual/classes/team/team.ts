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
        verbose = false,
    }: {
        string: string,
        verbose?: boolean,
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
    public getFullName({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.fullName;
    }
    
    public getRegionFull({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.regionFull;
    }

    public getRegionAbbr({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.regionAbbr;
    }

    public getIdentifierFull({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.identifierFull;
    }

    public getIdentifierAbbr({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        return this.identifierAbbr;
    }

    public getAltNames({
        verbose = false,
    }: {
        verbose?: boolean,
    }) {
        return this.altNames;
    }

    public getRegionAbbrIdentifierFull({
        verbose = false,
    }: {
        verbose?: boolean,
    } = {}) {
        const str = this.getRegionAbbr() + ' ' + this.getIdentifierFull();
        return str;
    }
}

export class Foo {
    
}