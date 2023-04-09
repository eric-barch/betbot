"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Odd = void 0;
class Odd {
    // private sequelize object
    // children hold their own sequelize reference
    // private constructor
    constructor({ exchange, statistic, updateFunction, }) {
        this.price = null;
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