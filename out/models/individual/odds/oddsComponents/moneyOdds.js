"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyOdds = void 0;
class MoneyOdds {
    constructor() {
        this.awayPrice = 0;
        this.homePrice = 0;
    }
    getAwayPrice() {
        return this.awayPrice;
    }
    getHomePrice() {
        return this.homePrice;
    }
    setAwayPrice({ awayPrice, }) {
        this.awayPrice = Number(awayPrice);
    }
    setHomePrice({ homePrice, }) {
        this.homePrice = Number(homePrice);
    }
}
exports.MoneyOdds = MoneyOdds;
//# sourceMappingURL=moneyOdds.js.map