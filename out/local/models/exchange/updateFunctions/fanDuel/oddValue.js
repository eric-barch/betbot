"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalUnder = exports.totalOver = exports.moneylineHome = exports.moneylineAway = exports.spreadUnder = exports.spreadOver = exports.map = void 0;
exports.map = new Map([
    ['spread_over', spreadOver],
    ['spread_under', spreadUnder],
    ['moneyline_away', moneylineAway],
    ['moneyline_home', moneylineHome],
    ['total_over', totalOver],
    ['total_under', totalUnder],
]);
async function spreadOver() {
    console.log('Run spreadOver.');
}
exports.spreadOver = spreadOver;
async function spreadUnder() {
    console.log('Run spreadUnder.');
}
exports.spreadUnder = spreadUnder;
async function moneylineAway() {
    console.log('Run moneylineAway.');
}
exports.moneylineAway = moneylineAway;
async function moneylineHome() {
    console.log('Run moneylineHome.');
}
exports.moneylineHome = moneylineHome;
async function totalOver() {
    console.log('Run totalOver.');
}
exports.totalOver = totalOver;
async function totalUnder() {
    console.log('Run totalUnder.');
}
exports.totalUnder = totalUnder;
//# sourceMappingURL=oddValue.js.map