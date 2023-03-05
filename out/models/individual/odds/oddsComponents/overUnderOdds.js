"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverUnderOdds = void 0;
class OverUnderOdds {
    constructor() {
        this.overUnder = 0;
        this.overPrice = 0;
        this.underPrice = 0;
    }
    getOverUnder() {
        return this.overUnder;
    }
    getOverPrice() {
        return this.overPrice;
    }
    getUnderPrice() {
        return this.underPrice;
    }
    setOverUnder({ overUnder, }) {
        this.overUnder = Number(overUnder);
    }
    setOverPrice({ overPrice, }) {
        this.overPrice = Number(overPrice);
    }
    setUnderPrice({ underPrice, }) {
        this.underPrice = Number(underPrice);
    }
}
exports.OverUnderOdds = OverUnderOdds;
//# sourceMappingURL=overUnderOdds.js.map