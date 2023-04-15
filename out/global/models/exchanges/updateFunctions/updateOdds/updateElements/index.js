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
exports.updateElementsFunctions = void 0;
const draftKings = __importStar(require("./draftKings"));
const fanDuel = __importStar(require("./fanDuel"));
exports.updateElementsFunctions = new Map([
    ['fanDuel_spread_away', fanDuel.spreadAway],
    ['fanDuel_spread_home', fanDuel.spreadHome],
    ['fanDuel_moneyline_away', fanDuel.moneylineAway],
    ['fanDuel_moneyline_home', fanDuel.moneylineHome],
    ['fanDuel_total_over', fanDuel.totalOver],
    ['fanDuel_total_under', fanDuel.totalUnder],
    ['draftKings_spread_away', draftKings.spreadAway],
    ['draftKings_spread_home', draftKings.spreadHome],
    ['draftKings_moneyline_away', draftKings.moneylineAway],
    ['draftKings_moneyline_home', draftKings.moneylineHome],
    ['draftKings_total_over', draftKings.totalOver],
    ['draftKings_total_under', draftKings.totalUnder],
]);
//# sourceMappingURL=index.js.map