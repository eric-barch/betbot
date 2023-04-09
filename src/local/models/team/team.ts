import * as globalModels from '../../../global/models';
import * as localModels from '../../../local/models';

export class Team {
    // public properties
    public regionFull: string;
    public regionAbbr: string;
    public identifierFull: string;
    public identifierAbbr: string;

    // private properties

    // public linked objects

    // private linked objects

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
        })

        globalModels.allTeams.add(newTeam);

        return newTeam;
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
}