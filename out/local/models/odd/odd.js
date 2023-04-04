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
exports.TotalOdd = exports.MoneyOdd = exports.SpreadOdd = exports.Odd = exports.ElementWrapperWithValue = exports.ElementWrapper = void 0;
const databaseModels = __importStar(require("../../../database/models"));
const globalModels = __importStar(require("../../../global/models"));
const parseFunctions = __importStar(require("./updateElementFunctions"));
class ElementWrapper {
    constructor({ exchange, game, parent, updateElementFunction, }) {
        this.wrappedElement = null;
        this.wrappedExchange = exchange;
        this.wrappedGame = game;
        if (parent) {
            this.wrappedParent = parent;
        }
        else {
            this.wrappedParent = null;
        }
        this.updateElementFunction = updateElementFunction;
    }
    async updateElement() {
        await this.updateElementFunction();
    }
    get parent() {
        if (this.wrappedParent) {
            return this.wrappedParent;
        }
        else {
            throw new Error(`wrappedParent is null.`);
        }
    }
    get element() {
        if (this.wrappedElement) {
            return this.wrappedElement;
        }
        else {
            return (async () => {
                await this.updateElementFunction();
                return this.wrappedElement;
            })();
        }
    }
    set element(element) {
        if (element instanceof Promise) {
            (async () => {
                const elementResolved = await element;
                this.wrappedElement = elementResolved;
            })();
        }
        else {
            this.wrappedElement = element;
        }
    }
    get exchange() {
        return this.wrappedExchange;
    }
    set exchange(exchange) {
        this.wrappedExchange = exchange;
    }
    get game() {
        return this.wrappedGame;
    }
    set game(game) {
        this.wrappedGame = game;
    }
}
exports.ElementWrapper = ElementWrapper;
class ElementWrapperWithValue extends ElementWrapper {
    constructor({ exchange, game, parent, updateElementFunction, }) {
        super({
            exchange: exchange,
            game: game,
            parent: parent,
            updateElementFunction: updateElementFunction,
        });
        this.wrappedValue = null;
    }
    async updateValue() {
        const element = await this.element;
        if (!element) {
            this.value = null;
            return;
        }
        const elementJson = await (await element.getProperty('textContent')).jsonValue();
        if (elementJson !== this.value) { // this is not going to work because the value getter returns null | number, not a string.
            console.log(`New odd found for ${this.exchange.name} ${this.game.name}: ${elementJson}`);
            this.value = elementJson;
        }
    }
    get value() {
        return this.wrappedValue;
    }
    set value(value) {
        if (value) {
            if (typeof value === 'string') {
                value = value.replace(/[^\d.-]/g, '');
            }
            this.wrappedValue = Number(value);
        }
        else {
            this.wrappedValue = null;
        }
    }
}
exports.ElementWrapperWithValue = ElementWrapperWithValue;
class Odd extends ElementWrapper {
    constructor({ exchange, game, }) {
        super({
            exchange: exchange,
            game: game,
            updateElementFunction: parseFunctions.fanDuel.odd,
        });
        this.spreadOdd = new SpreadOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.moneyOdd = new MoneyOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.totalOdd = new TotalOdd({
            exchange: exchange,
            game: game,
            parent: this,
        });
        this.wrappedSqlOdd = null;
    }
    // async construction methods
    static async create({ exchange, game, }) {
        const newOdd = new Odd({
            exchange: exchange,
            game: game,
        });
        await newOdd.init(); // Breaking here.
        globalModels.allOdds.add(newOdd);
        return newOdd;
    }
    async init() {
        const exchange = this.exchange;
        const game = this.game;
        const awayTeam = game.awayTeam;
        const homeTeam = game.homeTeam;
        const exchangeId = exchange.sqlExchange.get('id');
        const gameId = game.sqlGame.get('id'); // 
        const awayTeamId = awayTeam.sqlTeam.get('id');
        const homeTeamId = homeTeam.sqlTeam.get('id');
        const spreadOdd = this.spreadOdd;
        const moneyOdd = this.moneyOdd;
        const totalOdd = this.totalOdd;
        await databaseModels.Odd.findOrCreate({
            where: {
                exchangeId: exchangeId,
                gameId: gameId,
            },
            defaults: {
                spreadAwaySpread: spreadOdd.awaySpread.value,
                spreadHomeSpread: spreadOdd.homeSpread.value,
                spreadAwayPrice: spreadOdd.awayPrice.value,
                spreadHomePrice: spreadOdd.homePrice.value,
                moneyAwayPrice: moneyOdd.awayPrice.value,
                moneyHomePrice: moneyOdd.homePrice.value,
                totalTotal: totalOdd.overTotal.value,
                totalOverPrice: totalOdd.overTotalPrice.value,
                totalUnderPrice: totalOdd.underTotalPrice.value,
                exchangeId: exchangeId,
                gameId: gameId,
                awayTeamId: awayTeamId,
                homeTeamId: homeTeamId,
            },
        }).then(async ([sqlOdd, created]) => {
            if (!created) {
                // TODO: Insert code here that transfers the current odd over to 
                // OldOdd table.
                await sqlOdd.update({
                    spreadAwaySpread: spreadOdd.awaySpread.value,
                    spreadHomeSpread: spreadOdd.homeSpread.value,
                    spreadAwayPrice: spreadOdd.awayPrice.value,
                    spreadHomePrice: spreadOdd.homePrice.value,
                    moneyAwayPrice: moneyOdd.awayPrice.value,
                    moneyHomePrice: moneyOdd.homePrice.value,
                    totalTotal: totalOdd.overTotal.value,
                    totalOverPrice: totalOdd.overTotalPrice.value,
                    totalUnderPrice: totalOdd.underTotalPrice.value,
                    awayTeamId: awayTeamId,
                    homeTeamId: homeTeamId,
                });
            }
        });
    }
    // instance methods
    matchesByExchangeAndGame({ exchange, game, }) {
        if (this.exchange === exchange && this.game === game) {
            return true;
        }
        return false;
    }
    async updateComponentElements() {
        await this.updateElement();
        await this.spreadOdd.updateComponentElements();
        await this.moneyOdd.updateComponentElements();
        await this.totalOdd.updateComponentElements();
    }
    async updateValues() {
        await this.spreadOdd.updateValues();
        await this.moneyOdd.updateValues();
        await this.totalOdd.updateValues();
    }
    // getters and setters
    get sqlOdd() {
        if (this.wrappedSqlOdd) {
            return this.wrappedSqlOdd;
        }
        else {
            throw new Error(`${this.exchange.name} ${this.game.name} Odd sqlOdd is null.`);
        }
    }
    set sqlOdd(sqlOdd) {
        this.wrappedSqlOdd = sqlOdd;
    }
}
exports.Odd = Odd;
class SpreadOdd extends ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.spreadOdd,
        });
        this.awaySpread = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awaySpread,
        });
        this.awayPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awaySpreadPrice,
        });
        this.homeSpread = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeSpread,
        });
        this.homePrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeSpreadPrice,
        });
    }
    async updateComponentElements() {
        await this.updateElement();
        await this.awaySpread.updateElement();
        await this.awayPrice.updateElement();
        await this.homeSpread.updateElement();
        await this.homePrice.updateElement();
    }
    async updateValues() {
        await this.awaySpread.updateValue();
        await this.awayPrice.updateValue();
        await this.homeSpread.updateValue();
        await this.homePrice.updateValue();
    }
}
exports.SpreadOdd = SpreadOdd;
class MoneyOdd extends ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.moneyOdd,
        });
        this.awayPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.awayMoneyPrice,
        });
        this.homePrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.homeMoneyPrice,
        });
    }
    async updateComponentElements() {
        await this.updateElement();
        await this.awayPrice.updateElement();
        await this.homePrice.updateElement();
    }
    async updateValues() {
        await this.awayPrice.updateValue();
        await this.homePrice.updateValue();
    }
}
exports.MoneyOdd = MoneyOdd;
class TotalOdd extends ElementWrapper {
    constructor({ exchange, game, parent, }) {
        super({
            exchange: exchange,
            game: game,
            parent: parent,
            updateElementFunction: parseFunctions.fanDuel.totalOdd,
        });
        this.overTotal = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.overTotal,
        });
        this.overTotalPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.overTotalPrice,
        });
        this.underTotal = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.underTotal,
        });
        this.underTotalPrice = new ElementWrapperWithValue({
            exchange: exchange,
            game: game,
            parent: this,
            updateElementFunction: parseFunctions.fanDuel.underTotalPrice,
        });
    }
    async updateComponentElements() {
        await this.updateElement();
        await this.overTotal.updateElement();
        await this.overTotalPrice.updateElement();
        await this.underTotal.updateElement();
        await this.underTotalPrice.updateElement();
    }
    async updateValues() {
        await this.overTotal.updateValue();
        await this.overTotalPrice.updateValue();
        await this.underTotal.updateValue();
        await this.underTotalPrice.updateValue();
    }
}
exports.TotalOdd = TotalOdd;
//# sourceMappingURL=odd.js.map