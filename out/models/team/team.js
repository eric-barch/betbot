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
const models = __importStar(require("../../models"));
class Team {
    constructor({ regionFull, regionAbbr, identifierFull, identifierAbbr, altNames, }) {
        this.regionFull = regionFull;
        this.regionAbbr = regionAbbr;
        this.identifierFull = identifierFull;
        this.identifierAbbr = identifierAbbr;
        this.altNames = altNames;
        this.sequelizeInstance = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeInstance = new models.TeamSequelizeInstance({ team: this });
            yield this.sequelizeInstance.initialize();
        });
    }
    matchesByNameString({ string, }) {
        if (string === this.getRegionFullIdentifierFull() ||
            string === this.getRegionAbbrIdentifierFull()) {
            return true;
        }
        else {
            return false;
        }
    }
    // Getters
    getSequelizeInstance() {
        return this.sequelizeInstance;
    }
    getRegionFullIdentifierFull() {
        const regionFullIdentifierFull = `${this.getRegionFull()} ${this.getIdentifierFull()}`;
        return regionFullIdentifierFull;
    }
    getRegionAbbrIdentifierFull() {
        const regionAbbrIdentifierFull = `${this.getRegionAbbr()} ${this.getIdentifierFull}`;
        return regionAbbrIdentifierFull;
    }
    getRegionFull() {
        return this.regionFull;
    }
    getRegionAbbr() {
        return this.regionAbbr;
    }
    getIdentifierFull() {
        return this.identifierFull;
    }
    getIdentifierAbbr() {
        return this.identifierAbbr;
    }
    getAltNames() {
        return this.altNames;
    }
}
exports.Team = Team;
//# sourceMappingURL=team.js.map