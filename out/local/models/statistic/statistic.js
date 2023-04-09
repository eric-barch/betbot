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
exports.Statistic = void 0;
const globalModels = __importStar(require("../../../global/models"));
const localModels = __importStar(require("../../../local/models"));
class Statistic {
    // private linked objects
    // private constructor
    constructor({ name, game, }) {
        this.name = name;
        this.game = game;
        this.oddSet = new localModels.OddSet;
    }
    // public async constructor
    static async create({ name, game, }) {
        const newStatistic = new Statistic({
            name: name,
            game: game,
        });
        globalModels.allStatistics.add(newStatistic);
        return newStatistic;
    }
    // public instance methods
    matches({ name, game, }) {
        const nameMatches = (this.name === name);
        const gameMatches = (this.game === game);
        if (nameMatches && gameMatches) {
            return true;
        }
        return false;
    }
}
exports.Statistic = Statistic;
//# sourceMappingURL=statistic.js.map