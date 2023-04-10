"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = exports.sequelize = void 0;
const instance_1 = require("./instance");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return instance_1.sequelize; } });
const methods_1 = require("./methods");
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return methods_1.init; } });
const methods_2 = require("./methods");
Object.defineProperty(exports, "close", { enumerable: true, get: function () { return methods_2.close; } });
__exportStar(require("./models"), exports);
//# sourceMappingURL=index.js.map