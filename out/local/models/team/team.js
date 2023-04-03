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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    static create({ regionFull, regionAbbr, identifierFull, identifierAbbr, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTeam = new Team({
                regionFull: regionFull,
                regionAbbr: regionAbbr,
                identifierFull: identifierFull,
                identifierAbbr: identifierAbbr,
            });
            yield newTeam.init();
            globalModels.allTeams.add(newTeam);
            return newTeam;
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield databaseModels.Team.findOrCreate({
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
            }).then(([sqlTeam, created]) => __awaiter(this, void 0, void 0, function* () {
                if (!created) {
                    yield sqlTeam.update({
                        regionAbbr: this.regionAbbr,
                        identifierAbbr: this.identifierAbbr,
                    });
                }
                this.wrappedSqlTeam = sqlTeam;
            }));
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