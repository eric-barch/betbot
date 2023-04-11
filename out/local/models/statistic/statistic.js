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
const databaseModels = __importStar(require("../../../database"));
const globalModels = __importStar(require("../../../global"));
const localModels = __importStar(require("../../../local"));
class Statistic {
    // private constructor
    constructor({ name, game, updateOddsFunction, }) {
        this.name = name;
        this.updateOddsFunction = updateOddsFunction.bind(this);
        this.game = game;
        this.oddSet = new localModels.OddSet;
        this.wrappedSqlStatistic = null;
    }
    // public async constructor
    static async create({ name, game, updateOddsFunction, }) {
        const newStatistic = new Statistic({
            name: name,
            game: game,
            updateOddsFunction: updateOddsFunction,
        });
        await newStatistic.initSqlStatistic();
        globalModels.allStatistics.add(newStatistic);
        return newStatistic;
    }
    // private sequelize instance constructor
    async initSqlStatistic() {
        const game = this.game;
        const gameId = game.sqlGame.get('id');
        await databaseModels.Statistic.findOrCreate({
            where: {
                gameId: gameId,
                name: this.name,
            }
        }).then(async ([sqlStatistic, created]) => {
            if (!created) {
                await sqlStatistic.update({});
            }
            this.sqlStatistic = sqlStatistic;
        });
        return this.sqlStatistic;
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
    async updateOdds({ exchange, }) {
        // Every statistic will have a unique function to update its odds.
        await this.updateOddsFunction({
            exchange: exchange,
            statistic: this,
        });
    }
    // public static methods
    // getters and setters
    get sqlStatistic() {
        if (!this.wrappedSqlStatistic) {
            throw new Error(`${this.game.regionAbbrIdentifierAbbr} ${this.name} sqlStatistic is null.`);
        }
        return this.wrappedSqlStatistic;
    }
    set sqlStatistic(sqlStatistic) {
        this.wrappedSqlStatistic = sqlStatistic;
    }
}
exports.Statistic = Statistic;
//# sourceMappingURL=statistic.js.map