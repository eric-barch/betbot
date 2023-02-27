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
exports.nflTeams = void 0;
const state = __importStar(require("../../state"));
exports.nflTeams = [
    new state.Team({
        fullName: 'Arizona Cardinals',
        regionFullName: 'Arizona',
        regionAbbreviation: 'ARI',
        teamFullName: 'Cardinals',
        teamAbbreviation: 'Cards',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Atlanta Falcons',
        regionFullName: 'Atlanta',
        regionAbbreviation: 'ATL',
        teamFullName: 'Falcons',
        teamAbbreviation: 'Falcs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Baltimore Ravens',
        regionFullName: 'Baltimore',
        regionAbbreviation: 'BAL',
        teamFullName: 'Ravens',
        teamAbbreviation: 'Raves',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Buffalo Bills',
        regionFullName: 'Buffalo',
        regionAbbreviation: 'BUF',
        teamFullName: 'Bills',
        teamAbbreviation: 'Bills',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Carolina Panthers',
        regionFullName: 'Carolina',
        regionAbbreviation: 'CAR',
        teamFullName: 'Panthers',
        teamAbbreviation: 'Pants',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Chicago Bears',
        regionFullName: 'Chicago',
        regionAbbreviation: 'CHI',
        teamFullName: 'Bears',
        teamAbbreviation: 'Bears',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Cincinnati Bengals',
        regionFullName: 'Cincinnati',
        regionAbbreviation: 'CIN',
        teamFullName: 'Bengals',
        teamAbbreviation: 'Bengs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Cleveland Browns',
        regionFullName: 'Cleveland',
        regionAbbreviation: 'CLE',
        teamFullName: 'Browns',
        teamAbbreviation: 'Browns',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Dallas Cowboys',
        regionFullName: 'Dallas',
        regionAbbreviation: 'DAL',
        teamFullName: 'Cowboys',
        teamAbbreviation: 'Boys',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Denver Broncos',
        regionFullName: 'Denver',
        regionAbbreviation: 'DEN',
        teamFullName: 'Broncos',
        teamAbbreviation: 'Broncs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Detroit Lions',
        regionFullName: 'Detroit',
        regionAbbreviation: 'DET',
        teamFullName: 'Lions',
        teamAbbreviation: 'Lions',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Green Bay Packers',
        regionFullName: 'Green Bay',
        regionAbbreviation: 'GB',
        teamFullName: 'Packers',
        teamAbbreviation: 'Packs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Houston Texans',
        regionFullName: 'Houston',
        regionAbbreviation: 'HOU',
        teamFullName: 'Texans',
        teamAbbreviation: 'Texns',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Indianapolis Colts',
        regionFullName: 'Indianapolis',
        regionAbbreviation: 'IND',
        teamFullName: 'Colts',
        teamAbbreviation: 'Colts',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Jacksonville Jaguars',
        regionFullName: 'Jacksonville',
        regionAbbreviation: 'JAX',
        teamFullName: 'Jaguars',
        teamAbbreviation: 'Jags',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Kansas City Chiefs',
        regionFullName: 'Kansas City',
        regionAbbreviation: 'KC',
        teamFullName: 'Chiefs',
        teamAbbreviation: 'Chiefs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Las Vegas Raiders',
        regionFullName: 'Las Vegas',
        regionAbbreviation: 'LAV',
        teamFullName: 'Raiders',
        teamAbbreviation: 'Raids',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Los Angeles Chargers',
        regionFullName: 'Los Angeles',
        regionAbbreviation: 'LAC',
        teamFullName: 'Chargers',
        teamAbbreviation: 'Chargers',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Los Angeles Rams',
        regionFullName: 'Los Angeles',
        regionAbbreviation: 'LAR',
        teamFullName: 'Rams',
        teamAbbreviation: 'Rams',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Miami Dolphins',
        regionFullName: 'Miami',
        regionAbbreviation: 'MIA',
        teamFullName: 'Dolphins',
        teamAbbreviation: 'Fins',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Minnesota Vikings',
        regionFullName: 'Minnesota',
        regionAbbreviation: 'MIN',
        teamFullName: 'Vikings',
        teamAbbreviation: 'Vikes',
        altNames: [],
    }),
    new state.Team({
        fullName: 'New England Patriots',
        regionFullName: 'New England',
        regionAbbreviation: 'NE',
        teamFullName: 'Patriots',
        teamAbbreviation: 'Pats',
        altNames: [],
    }),
    new state.Team({
        fullName: 'New Orleans Saints',
        regionFullName: 'New Orleans',
        regionAbbreviation: 'NO',
        teamFullName: 'Saints',
        teamAbbreviation: 'Saints',
        altNames: [],
    }),
    new state.Team({
        fullName: 'New York Giants',
        regionFullName: 'New York',
        regionAbbreviation: 'NYG',
        teamFullName: 'Giants',
        teamAbbreviation: 'G-Men',
        altNames: [],
    }),
    new state.Team({
        fullName: 'New York Jets',
        regionFullName: 'New York',
        regionAbbreviation: 'NYJ',
        teamFullName: 'Jets',
        teamAbbreviation: 'Jets',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Philadelphia Eagles',
        regionFullName: 'Philadelphia',
        regionAbbreviation: 'PHI',
        teamFullName: 'Eagles',
        teamAbbreviation: 'Eags',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Pittsburgh Steelers',
        regionFullName: 'Pittsburgh',
        regionAbbreviation: 'PIT',
        teamFullName: 'Steelers',
        teamAbbreviation: 'Steels',
        altNames: [],
    }),
    new state.Team({
        fullName: 'San Francisco 49ers',
        regionFullName: 'San Francisco',
        regionAbbreviation: 'SF',
        teamFullName: '49ers',
        teamAbbreviation: 'Niners',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Seattle Seahawks',
        regionFullName: 'Seattle',
        regionAbbreviation: 'SEA',
        teamFullName: 'Seahawks',
        teamAbbreviation: 'Hawks',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Tampa Bay Buccaneers',
        regionFullName: 'Tampa Bay',
        regionAbbreviation: 'TB',
        teamFullName: 'Buccaneers',
        teamAbbreviation: 'Bucs',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Tennessee Titans',
        regionFullName: 'Tennessee',
        regionAbbreviation: 'TEN',
        teamFullName: 'Titans',
        teamAbbreviation: 'Titans',
        altNames: [],
    }),
    new state.Team({
        fullName: 'Washington Commanders',
        regionFullName: 'Washington',
        regionAbbreviation: 'WAS',
        teamFullName: 'Commanders',
        teamAbbreviation: 'Commanders',
        altNames: [],
    })
];
