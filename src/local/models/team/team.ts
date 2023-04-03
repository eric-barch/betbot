import * as databaseModels from '../../../database/models';
import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Team {
    public regionFull: string;
    public regionAbbr: string;
    public identifierFull: string;
    public identifierAbbr: string;

    private wrappedSqlTeam: databaseModels.Team | null;

    constructor({
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

    // async construction methods
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
        })

        await newTeam.init();

        globalModels.allTeams.add(newTeam);

        return newTeam;
    }

    private async init(): Promise<void> {
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
    }

    // instance methods
    public matchesByNameString({
        nameString,
    }: {
        nameString: string,
    }): boolean {
        if (
            nameString === this.regionFullIdentifierFull ||
            nameString === this.regionAbbrIdentifierFull ||
            nameString === this.regionAbbrIdentifierAbbr
        ) {
            return true;
        } else {
            return false;
        }
    }

    // getters and setters
    get name(): string {
        return this.regionFullIdentifierFull;
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
        if (this.wrappedSqlTeam) {
            return this.wrappedSqlTeam;
        } else {
            throw new Error(`${this.name} sqlTeamj is null.`);
        }
    }

    set sqlTeam(sqlTeam: databaseModels.Team) {
        this.wrappedSqlTeam = sqlTeam;
    }
}