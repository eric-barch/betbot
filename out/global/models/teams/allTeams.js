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
exports.initAllTeams = exports.allTeams = void 0;
const leagues = __importStar(require("./leagues"));
const team_1 = require("../../../local/models/team");
exports.allTeams = new team_1.TeamSet();
async function initAllTeams() {
    for (const team of leagues.nbaTeams) {
        const newTeam = await team_1.Team.create({
            regionFull: team.regionFull,
            regionAbbr: team.regionAbbr,
            identifierFull: team.identifierFull,
            identifierAbbr: team.identifierAbbr,
        });
        exports.allTeams.add(newTeam);
    }
}
exports.initAllTeams = initAllTeams;
//# sourceMappingURL=allTeams.js.map