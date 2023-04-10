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
exports.updateFunctionsMap = void 0;
const fanDuel = __importStar(require("./fanDuel"));
exports.updateFunctionsMap = new Map([
    ['fanDuel_spread_test', {
            updatePriceElementFunction: fanDuel.spreadTest,
            updateValueElementFunction: fanDuel.spreadTest,
        }],
    ['fanDuel_spread_over', {
            updatePriceElementFunction: fanDuel.awaySpreadPrice,
            updateValueElementFunction: fanDuel.awaySpread,
        }],
    ['fanDuel_spread_under', {
            updatePriceElementFunction: fanDuel.homeSpreadPrice,
            updateValueElementFunction: fanDuel.homeSpread,
        }],
    ['fanDuel_money_equal_away', {
            updatePriceElementFunction: fanDuel.awayMoneyPrice,
            updateValueElementFunction: fanDuel.awayMoney,
        }],
    ['fanDuel_money_equal_home', {
            updatePriceElementFunction: fanDuel.homeMoneyPrice,
            updateValueElementFunction: fanDuel.homeMoney,
        }],
    ['fanDuel_total_over', {
            updatePriceElementFunction: fanDuel.overTotalPrice,
            updateValueElementFunction: fanDuel.overTotal,
        }],
    ['fanDuel_total_under', {
            updatePriceElementFunction: fanDuel.underTotalPrice,
            updateValueElementFunction: fanDuel.underTotal,
        }]
]);
//# sourceMappingURL=updateFunctionsMap.js.map