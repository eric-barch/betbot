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
exports.OddSet = exports.Odd = void 0;
const odd_1 = require("./odd");
Object.defineProperty(exports, "Odd", { enumerable: true, get: function () { return odd_1.Odd; } });
const oddSet_1 = require("./oddSet");
Object.defineProperty(exports, "OddSet", { enumerable: true, get: function () { return oddSet_1.OddSet; } });
__exportStar(require("./continuousOdd"), exports);
__exportStar(require("./discreteOdd"), exports);
//# sourceMappingURL=index.js.map