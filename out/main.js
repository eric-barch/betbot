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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database = __importStar(require("./database"));
const globalModels = __importStar(require("./global"));
const allExchanges = globalModels.allExchanges;
console.log(allExchanges);
async function main() {
    await database.init();
    await globalModels.init();
    while (true) {
        const startTime = new Date();
        await allExchanges.analyze();
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        console.log(`total duration: ${endTime.getTime() - startTime.getTime()}\n`);
    }
    process.exit(0);
}
main();
// Without web analysis, analyze takes about 10 milliseconds.
//# sourceMappingURL=main.js.map