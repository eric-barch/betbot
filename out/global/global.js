"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const models_1 = require("./models");
async function init() {
    await (0, models_1.initAllTeams)();
    await (0, models_1.initAllExchanges)();
}
exports.init = init;
//# sourceMappingURL=global.js.map