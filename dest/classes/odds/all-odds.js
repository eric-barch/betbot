"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllOdds = void 0;
class AllOdds {
    constructor({ odds, } = {}) {
        if (odds) {
            this.odds = odds;
        }
        else {
            this.odds = [];
        }
    }
}
exports.AllOdds = AllOdds;
