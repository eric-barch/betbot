"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverUnderOdds = void 0;
class OverUnderOdds {
    constructor({ verbose = false, } = {}) {
        this.overUnder = 0;
        this.overPrice = 0;
        this.underPrice = 0;
    }
    getOverUnder({ verbose = false, } = {}) {
        return this.overUnder;
    }
    getOverPrice({ verbose = false, } = {}) {
        return this.overPrice;
    }
    getUnderPrice({ verbose = false, } = {}) {
        return this.underPrice;
    }
    setOverUnder({ overUnder, verbose = false, }) {
        this.overUnder = overUnder;
    }
    setOverPrice({ overPrice, verbose = false, }) {
        this.overPrice = overPrice;
    }
    setUnderPrice({ underPrice, verbose = false, }) {
        this.underPrice = underPrice;
    }
}
exports.OverUnderOdds = OverUnderOdds;
