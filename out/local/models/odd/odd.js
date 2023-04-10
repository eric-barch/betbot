"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odd = exports.Inequality = void 0;
var Inequality;
(function (Inequality) {
    Inequality["Over"] = "over";
    Inequality["Equal"] = "equal";
    Inequality["Under"] = "under";
})(Inequality = exports.Inequality || (exports.Inequality = {}));
class Odd {
    // private constructor
    constructor({ exchange, statistic, inequality, updateFunction, }) {
        this.inequality = inequality;
        this.wrappedPrice = null;
        this.updateFunction = updateFunction;
        this.exchange = exchange;
        this.statistic = statistic;
        this.exchange.oddSet.add(this);
        this.statistic.oddSet.add(this);
    }
    // public instance methods
    matches({ exchange, statistic, }) {
        const exchangeMatches = (this.exchange === exchange);
        const statisticMatches = (this.statistic === statistic);
        if (exchangeMatches && statisticMatches) {
            return true;
        }
        return false;
    }
    async update() {
        if (!this.updateFunction) {
            throw new Error(`Update function is null.`);
        }
        await this.updateFunction();
    }
}
exports.Odd = Odd;
//# sourceMappingURL=odd.js.map