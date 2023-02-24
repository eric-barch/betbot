"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyOdds = void 0;
class MoneyOdds {
    constructor({ verbose = false, } = {}) {
        this.awayPrice = 0;
        this.homePrice = 0;
    }
    getAwayPrice({ verbose = false, } = {}) {
        return this.awayPrice;
    }
    getHomePrice({ verbose = false, } = {}) {
        return this.homePrice;
    }
    setAwayPrice({ awayPrice, verbose = false, }) {
        this.awayPrice = awayPrice;
    }
    setHomePrice({ homePrice, verbose = false, }) {
        this.homePrice = homePrice;
    }
}
exports.MoneyOdds = MoneyOdds;
