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
    // public async constructor
    // cannot instantiate abstract class
    // private sequelize instance constructor
    // children hold their own sequelize reference
    // public instance methods
    async update() {
        await this.updateFunction;
    }
}
exports.Odd = Odd;
//# sourceMappingURL=odd.js.map