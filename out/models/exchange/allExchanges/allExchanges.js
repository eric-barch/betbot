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
exports.allExchanges = void 0;
const exchange_1 = require("../exchange");
const exchangeSet_1 = require("../exchangeSet");
const parseFunctions = __importStar(require("./parseFunctions"));
exports.allExchanges = new exchangeSet_1.ExchangeSet();
exports.allExchanges.add(new exchange_1.Exchange({
    name: 'Caesar\'s',
    url: 'https://www.williamhill.com/us/ny/bet/basketball',
    parseFunction: parseFunctions.parseCaesars,
}));
exports.allExchanges.add(new exchange_1.Exchange({
    name: 'DraftKings',
    url: 'https://sportsbook.draftkings.com/leagues/basketball/nba',
    parseFunction: parseFunctions.parseDraftKings,
}));
exports.allExchanges.add(new exchange_1.Exchange({
    name: 'FanDuel',
    url: 'https://sportsbook.fanduel.com/navigation/nba',
    parseFunction: parseFunctions.parseFanDuel,
}));
//# sourceMappingURL=allExchanges.js.map