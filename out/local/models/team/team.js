"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
class Team {
    constructor({ regionFull, regionAbbr, identifierFull, identifierAbbr, }) {
        this.regionFull = regionFull;
        this.regionAbbr = regionAbbr;
        this.identifierFull = identifierFull;
        this.identifierAbbr = identifierAbbr;
        this.wrappedSqlTeam = null;
    }
    // async construction methods
    static async create({ regionFull, regionAbbr, identifierFull, identifierAbbr, }) {
        const newTeam = new Team({
            regionFull: regionFull,
            regionAbbr: regionAbbr,
            identifierFull: identifierFull,
            identifierAbbr: identifierAbbr,
        });
        await newTeam.init();
        globalModels.allTeams.add(newTeam);
        return newTeam;
    }
    async init() {
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
    matchesByNameString({ nameString, }) {
        if (nameString === this.regionFullIdentifierFull ||
            nameString === this.regionAbbrIdentifierFull ||
            nameString === this.regionAbbrIdentifierAbbr) {
            return true;
        }
        else {
            return false;
        }
    }
    // getters and setters
    get name() {
        return this.regionFullIdentifierFull;
    }
    get regionFullIdentifierFull() {
        const regionFullIdentifierFull = `${this.regionFull} ${this.identifierFull}`;
        return regionFullIdentifierFull;
    }
    get regionAbbrIdentifierFull() {
        const regionAbbrIdentifierFull = `${this.regionAbbr} ${this.identifierFull}`;
        return regionAbbrIdentifierFull;
    }
    get regionAbbrIdentifierAbbr() {
        const regionAbbrIdentifierAbbr = `${this.regionAbbr} ${this.identifierAbbr}`;
        return regionAbbrIdentifierAbbr;
    }
    get sqlTeam() {
        if (this.wrappedSqlTeam) {
            return this.wrappedSqlTeam;
        }
        else {
            throw new Error(`${this.name} sqlTeamj is null.`);
        }
    }
    set sqlTeam(sqlTeam) {
        this.wrappedSqlTeam = sqlTeam;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map