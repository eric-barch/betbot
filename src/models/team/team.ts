import * as databaseModels from '../../database/models';
import * as models from '../../models';

export class Team {
    private regionFull: string;
    private regionAbbr: string;
    private identifierFull: string;
    private identifierAbbr: string;
    private altNames: Set<string>;
    private sequelizeInstance: databaseModels.TeamSequelizeInstance | null;

    constructor({
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
        altNames: Set<string>,
    }) {
        this.regionFull = regionFull;
        this.regionAbbr = regionAbbr;
        this.identifierFull = identifierFull;
        this.identifierAbbr = identifierAbbr;
        this.altNames = altNames;
        this.sequelizeInstance = null;
    }

    public async initialize() {
        this.sequelizeInstance = new databaseModels.TeamSequelizeInstance({team: this});
        await this.sequelizeInstance.initialize();
    }

    public matchesByNameString({
        string,
    }: {
        string: string,
    }) {
        if (
            string === this.getRegionFullIdentifierFull() ||
            string === this.getRegionAbbrIdentifierFull()
        ) {
            return true;
        } else {
            return false;
        }
    }

    // Getters
    public getSequelizeInstance() {
        return this.sequelizeInstance;
    }
    
    public getRegionFullIdentifierFull() {
        const regionFullIdentifierFull = `${this.getRegionFull()} ${this.getIdentifierFull()}`;
        return regionFullIdentifierFull;
    }

    public getRegionAbbrIdentifierFull() {
        const regionAbbrIdentifierFull = `${this.getRegionAbbr()} ${this.getIdentifierFull}`;
        return regionAbbrIdentifierFull;
    }

    public getRegionAbbrIdentifierAbbr() {
        const regionAbbrIdentifierAbbr = `${this.getRegionAbbr()} ${this.getIdentifierAbbr()}`;
        return regionAbbrIdentifierAbbr;
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
}