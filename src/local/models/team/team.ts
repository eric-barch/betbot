import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../../../local';

export class Team {
    // public properties
    public regionFull: string;
    public regionAbbr: string;
    public identifierFull: string;
    public identifierAbbr: string;

    // private properties

    // public linked objects

    // private linked objects

    // private sequelize objects
    private wrappedSqlTeam: databaseModels.Team | null;

    // private constructor
    private constructor({
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

    // public async constructor
    public static async create({
        regionFull,
        regionAbbr,
        identifierFull,
        identifierAbbr,
    }: {
        regionFull: string,
        regionAbbr: string,
        identifierFull: string,
        identifierAbbr: string,
    }): Promise<localModels.Team> {
        const newTeam = new Team({
            regionFull: regionFull,
            regionAbbr: regionAbbr,
            identifierFull: identifierFull,
            identifierAbbr: identifierAbbr,
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
    public matches({
        name,
    }: {
        name: string,
    }): boolean {
        if (
            name === this.regionFullIdentifierFull ||
            name === this.regionAbbrIdentifierFull ||
            name === this.regionAbbrIdentifierAbbr
        ) {
            return true;
        }
        
        return false;
    }

    // public static methods

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