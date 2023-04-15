"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddSet = void 0;
const odd_1 = require("./odd");
class OddSet extends Set {
    async findOrCreate({ exchange, statistic, updateOddElementsFunction, }) {
        for (const odd of this) {
            if (odd.matches({
                exchange: exchange,
                statistic: statistic,
            })) {
                return odd;
            }
        }
        const newOdd = await odd_1.Odd.create({
            exchange: exchange,
            statistic: statistic,
            updateOddElementsFunction: updateOddElementsFunction,
        });
        this.add(newOdd);
        return newOdd;
    }
    async updateValues() {
        for (const odd of this) {
            await odd.updateValues();
        }
    }
}
exports.OddSet = OddSet;
//# sourceMappingURL=oddSet.js.map