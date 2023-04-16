import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Team {
    // public properties
    public regionFull: string;
    public regionAbbr: string;
    public identifierFull: string;
    public identifierAbbr: string;
    public altNames: string[];

    // private sequelize objects
    private wrappedSqlTeam: databaseModels.Team | null;

    // private constructor
    private constructor({
        regionFull,
        regionAbbr,
        identifierFull,
        identifierAbbr,
        altNames,
    }: {
        regionFull: string,
        regionAbbr: string,
        identifierFull: string,
        identifierAbbr: string,
        altNames: Array<string>,
    }) {
        this.regionFull = regionFull;
        this.regionAbbr = regionAbbr;
        this.identifierFull = identifierFull;
        this.identifierAbbr = identifierAbbr;
        this.wrappedSqlTeam = null;
        this.altNames = altNames;
    }

    // public async constructor
    public static async create({
        regionFull,
        regionAbbr,
        identifierFull,
        identifierAbbr,
        altNames,
    }: {
        regionFull: string,
        regionAbbr: string,
        identifierFull: string,
        identifierAbbr: string,
        altNames: Array<string>,
    }): Promise<localModels.Team> {
        const newTeam = new Team({
            regionFull: regionFull,
            regionAbbr: regionAbbr,
            identifierFull: identifierFull,
            identifierAbbr: identifierAbbr,
            altNames: altNames,
        });

        await newTeam.initSqlTeam();

        globalModels.allTeams.add(newTeam);

        return newTeam;
    }

    // private sequelize instance constructor
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

            this.sqlTeam = sqlTeam;
        });

        return this.sqlTeam;
    }

    // public instance methods
    // TODO: Can make this better/simpler
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

        for (const altName of this.altNames) {
            if (name.includes(altName)) {
                return true;
            }
        }
        
        return false;
    }

    // getters and setters
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

    set sqlTeam(sqlTeam: databaseModels.Team) {
        this.wrappedSqlTeam = sqlTeam;
    }
}