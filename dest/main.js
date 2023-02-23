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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database = __importStar(require("./database"));
const state = __importStar(require("./state"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database.instance.initiate();
        yield state.exchanges.initiate();
        // /** Web scraping. */
        // for (let exchange of state.exchanges) {
        //     let pageReader = await exchange.getPageReader();
        //     verbose ? console.log() : null;
        //     await pageReader.connect({verbose: verbosity.pageReader.init});
        //     verbose ? console.log() : null;
        //     await pageReader.scrape({verbose: verbosity.pageReader.scrape});
        //     let pageParser = await exchange.getPageParser();
        //     verbose ? console.log() : null;
        //     await pageParser.setPageContent({
        //         html: pageReader.getHtml(),
        //         verbose: verbosity.pageParser.init,
        //     });
        //     verbose ? console.log() : null;
        //     await pageParser.parse({verbose: verbosity.pageParser.parse});
        // }
        /** Close connection with MySQL. */
        yield database.instance.instance.close();
        /** Close all exchange objects and their Puppeteer-based utilities. */
        // for (const exchange of state.exchanges) {
        //     verbosity.exchangeObject.close ? console.log() : null;
        //     await exchange.close({verbose: verbosity.exchangeObject.close});
        // }
    });
}
main();
/** TODO: If possible, remove all '!'s and '?'s re: typing.
 * Fix verbosity tags so that it matches granularity of object structure.
*/ 
