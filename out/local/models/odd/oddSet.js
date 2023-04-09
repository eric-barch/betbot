"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OddSet = void 0;
class OddSet extends Set {
    async update() {
        for (const odd of this) {
            await odd.update();
        }
    }
}
exports.OddSet = OddSet;
//# sourceMappingURL=oddSet.js.map