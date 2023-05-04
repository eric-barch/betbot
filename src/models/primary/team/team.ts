import * as database from '../../../database';

export class Team {
    private wrappedRegionFull: string;
    private wrappedRegionAbbr: string;
    private wrappedIdentifierFull: string;
    private wrappedIdentifierAbbr: string;
    private wrappedSqlTeam: database.Team | null;
    
    public constructor({
        regionFull,
        regionAbbr,
        identifierFull,
        identifierAbbr,
    }: {
        regionFull: string,
        regionAbbr: string,
        identifierFull: string,
        identifierAbbr: string,
    }) {
        this.wrappedRegionFull = regionFull;
        this.wrappedRegionAbbr = regionAbbr;
        this.wrappedIdentifierFull = identifierFull;
        this.wrappedIdentifierAbbr = identifierAbbr;
        this.wrappedSqlTeam = null;
    }

    public async init(): Promise<Team> {
        await this.initSqlTeam();
        return this;
    }

    private async initSqlTeam(): Promise<database.Team> {
        await database.Team.findOrCreate({
            where: {
                regionFull: this.regionFull,
                identifierFull: this.identifierFull,
            },
            defaults: {
                regionFull: this.regionFull,
                regionAbbr: this.regionAbbr,
                identifierFull: this.identifierFull,
                identifierAbbr: this.identifierAbbr,
            },
        }).then(async ([sqlTeam, created]) => {
            if (!created) {
                await sqlTeam.update({
                    regionAbbr: this.regionAbbr,
                    identifierAbbr: this.identifierAbbr,
                });
            }

            this.wrappedSqlTeam = sqlTeam;
        });

        return this.sqlTeam;
    }

    public matches({
        name,
    }: {
        name: string,
    }): boolean {
        const nameLowerCase = name.toLowerCase();
        const identifierFullLowerCase = this.wrappedIdentifierFull.toLowerCase();

        if (nameLowerCase.includes(identifierFullLowerCase)) {
            return true;
        }
        
        return false;
    }

    get regionFull(): string {
        return this.wrappedRegionFull;
    }

    get regionAbbr(): string {
        return this.wrappedRegionAbbr;
    }

    get identifierFull(): string {
        return this.wrappedIdentifierFull;
    }

    get identifierAbbr(): string {
        return this.wrappedIdentifierAbbr;
    }

    get regionFullIdentifierFull(): string {
        const regionFullIdentifierFull = `${this.regionFull} ${this.identifierFull}`;
        return regionFullIdentifierFull;
    }

    get regionAbbrIdentifierFull(): string {
        const regionAbbrIdentifierFull = `${this.regionAbbr} ${this.identifierFull}`;
        return regionAbbrIdentifierFull;
    }

    get regionAbbrIdentifierAbbr(): string {
        const regionAbbrIdentifierAbbr = `${this.regionAbbr} ${this.identifierAbbr}`;
        return regionAbbrIdentifierAbbr;
    }

    get sqlTeam(): database.Team {
        if (!this.wrappedSqlTeam) {
            throw new Error(`${this.regionFullIdentifierFull} sqlTeamj is null.`);
        }

        return this.wrappedSqlTeam;
    }
}