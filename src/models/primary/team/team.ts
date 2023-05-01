import * as databaseModels from '../../../database';

export class Team {
    public regionFull: string;
    public regionAbbr: string;
    public identifierFull: string;
    public identifierAbbr: string;

    private wrappedSqlTeam: databaseModels.Team | null;
    
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
        this.regionFull = regionFull;
        this.regionAbbr = regionAbbr;
        this.identifierFull = identifierFull;
        this.identifierAbbr = identifierAbbr;

        this.wrappedSqlTeam = null;
    }

    public async init(): Promise<Team> {
        await this.initSqlTeam();
        return this;
    }

    private async initSqlTeam(): Promise<databaseModels.Team> {
        await databaseModels.Team.findOrCreate({
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

    /**TODO: Can make this better/simpler */
    public matches({
        name,
    }: {
        name: string,
    }): boolean {
        if (
            name.includes(this.regionFullIdentifierFull)||
            name.includes(this.regionAbbrIdentifierFull) ||
            name.includes(this.regionAbbrIdentifierAbbr)
        ) {
            return true;
        }
        
        return false;
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

    get sqlTeam(): databaseModels.Team {
        if (!this.wrappedSqlTeam) {
            throw new Error(`${this.regionFullIdentifierFull} sqlTeamj is null.`);
        }

        return this.wrappedSqlTeam;
    }
}