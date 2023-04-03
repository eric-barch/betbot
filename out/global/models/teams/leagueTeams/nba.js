"use strict";
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
exports.nba = void 0;
const models_1 = require("../../../../local/models");
exports.nba = await (() => __awaiter(void 0, void 0, void 0, function* () {
    const teams = [
        yield models_1.Team.create({
            regionFull: 'Atlanta',
            regionAbbr: 'ATL',
            identifierFull: 'Hawks',
            identifierAbbr: 'Hawks',
        }),
        yield models_1.Team.create({
            regionFull: 'Boston',
            regionAbbr: 'BOS',
            identifierFull: 'Celtics',
            identifierAbbr: 'Celtics',
        }),
        yield models_1.Team.create({
            regionFull: 'Brooklyn',
            regionAbbr: 'BKN',
            identifierFull: 'Nets',
            identifierAbbr: 'Nets',
        }),
        yield models_1.Team.create({
            regionFull: 'Charlotte',
            regionAbbr: 'CHA',
            identifierFull: 'Hornets',
            identifierAbbr: 'Hornets',
        }),
        yield models_1.Team.create({
            regionFull: 'Chicago',
            regionAbbr: 'CHI',
            identifierFull: 'Bulls',
            identifierAbbr: 'Bulls',
        }),
        yield models_1.Team.create({
            regionFull: 'Cleveland',
            regionAbbr: 'CLE',
            identifierFull: 'Cavaliers',
            identifierAbbr: 'Cavs',
        }),
        yield models_1.Team.create({
            regionFull: 'Dallas',
            regionAbbr: 'DAL',
            identifierFull: 'Mavericks',
            identifierAbbr: 'Mavs',
        }),
        yield models_1.Team.create({
            regionFull: 'Denver',
            regionAbbr: 'DEN',
            identifierFull: 'Nuggets',
            identifierAbbr: 'Nugs',
        }),
        yield models_1.Team.create({
            regionFull: 'Detroit',
            regionAbbr: 'DET',
            identifierFull: 'Pistons',
            identifierAbbr: 'Pistons',
        }),
        yield models_1.Team.create({
            regionFull: 'Golden State',
            regionAbbr: 'GSW',
            identifierFull: 'Warriors',
            identifierAbbr: 'Warriors',
        }),
        yield models_1.Team.create({
            regionFull: 'Houston',
            regionAbbr: 'HOU',
            identifierFull: 'Rockets',
            identifierAbbr: 'Rockets',
        }),
        yield models_1.Team.create({
            regionFull: 'Indiana',
            regionAbbr: 'IND',
            identifierFull: 'Pacers',
            identifierAbbr: 'Pacers',
        }),
        yield models_1.Team.create({
            regionFull: 'Los Angeles',
            regionAbbr: 'LAC',
            identifierFull: 'Clippers',
            identifierAbbr: 'Clippers',
        }),
        yield models_1.Team.create({
            regionFull: 'Los Angeles',
            regionAbbr: 'LAL',
            identifierFull: 'Lakers',
            identifierAbbr: 'Lakers',
        }),
        yield models_1.Team.create({
            regionFull: 'Memphis',
            regionAbbr: 'MEM',
            identifierFull: 'Grizzlies',
            identifierAbbr: 'Grizzlies',
        }),
        yield models_1.Team.create({
            regionFull: 'Miami',
            regionAbbr: 'MIA',
            identifierFull: 'Heat',
            identifierAbbr: 'Heat',
        }),
        yield models_1.Team.create({
            regionFull: 'Milwaukee',
            regionAbbr: 'MIL',
            identifierFull: 'Bucks',
            identifierAbbr: 'Bucks',
        }),
        yield models_1.Team.create({
            regionFull: 'Minnesota',
            regionAbbr: 'MIN',
            identifierFull: 'Timberwolves',
            identifierAbbr: 'Wolves',
        }),
        yield models_1.Team.create({
            regionFull: 'New Orleans',
            regionAbbr: 'NOP',
            identifierFull: 'Pelicans',
            identifierAbbr: 'Pels',
        }),
        yield models_1.Team.create({
            regionFull: 'New York',
            regionAbbr: 'NYK',
            identifierFull: 'Knicks',
            identifierAbbr: 'Knicks',
        }),
        yield models_1.Team.create({
            regionFull: 'Oklahoma City',
            regionAbbr: 'OKC',
            identifierFull: 'Thunder',
            identifierAbbr: 'Thunder',
        }),
        yield models_1.Team.create({
            regionFull: 'Orlando',
            regionAbbr: 'ORL',
            identifierFull: 'Magic',
            identifierAbbr: 'Magic',
        }),
        yield models_1.Team.create({
            regionFull: 'Philadelphia',
            regionAbbr: 'PHI',
            identifierFull: '76ers',
            identifierAbbr: 'Sixers',
        }),
        yield models_1.Team.create({
            regionFull: 'Phoenix',
            regionAbbr: 'PHX',
            identifierFull: 'Suns',
            identifierAbbr: 'Suns',
        }),
        yield models_1.Team.create({
            regionFull: 'Portland',
            regionAbbr: 'POR',
            identifierFull: 'Trail Blazers',
            identifierAbbr: 'Blazers',
        }),
        yield models_1.Team.create({
            regionFull: 'Sacramento',
            regionAbbr: 'SAC',
            identifierFull: 'Kings',
            identifierAbbr: 'Kings',
        }),
        yield models_1.Team.create({
            regionFull: 'San Antonio',
            regionAbbr: 'SAS',
            identifierFull: 'Spurs',
            identifierAbbr: 'Spurs',
        }),
        yield models_1.Team.create({
            regionFull: 'Toronto',
            regionAbbr: 'TOR',
            identifierFull: 'Raptors',
            identifierAbbr: 'Raptors',
        }),
        yield models_1.Team.create({
            regionFull: 'Utah',
            regionAbbr: 'UTA',
            identifierFull: 'Jazz',
            identifierAbbr: 'Jazz',
        }),
        yield models_1.Team.create({
            regionFull: 'Washington',
            regionAbbr: 'WAS',
            identifierFull: 'Wizards',
            identifierAbbr: 'Wizards',
        })
    ];
    return teams;
}))();
//# sourceMappingURL=nba.js.map