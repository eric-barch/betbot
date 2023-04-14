"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeSet = void 0;
class ExchangeSet extends Set {
    async close() {
        for (const exchange of this) {
            await exchange.close();
        }
    }
}
exports.ExchangeSet = ExchangeSet;
//# sourceMappingURL=exchangeSet.js.map