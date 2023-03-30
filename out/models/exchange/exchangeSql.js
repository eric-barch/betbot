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
exports.ExchangeSql = exports.SequelizeExchangeModel = void 0;
const sequelize = __importStar(require("sequelize"));
const database = __importStar(require("../../database"));
exports.SequelizeExchangeModel = database.instance.define('Exchange', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.DataTypes.STRING,
    url: sequelize.DataTypes.STRING,
});
class ExchangeSql {
    constructor({ exchange, }) {
        this.exchange = exchange;
        this.sequelizeModel = null;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelizeModel = yield exports.SequelizeExchangeModel.findOrCreate({
                where: {
                    name: this.exchange.getName(),
                },
                defaults: {
                    name: this.getExchange().getName(),
                    url: this.getExchange().getUrl(),
                },
            }).then(([exchange, created]) => {
                if (created) {
                    console.log("Exchange created: ", exchange.get({ plain: true }));
                }
                else {
                    console.log("Exchange already exists:", exchange.get({ plain: true }));
                    const rowData = exchange.get({ plain: true });
                    if (rowData.url !== this.getExchange().getUrl()) {
                        exports.SequelizeExchangeModel.update({ url: this.getExchange().getUrl() }, { where: {
                                name: this.getExchange().getName(),
                            } }).then(() => {
                            console.log(`Database URL updated to match program URL.`);
                        });
                    }
                    else {
                        console.log(`Database URL matches program URL. No update necessary.`);
                    }
                }
            });
        });
    }
    getExchange() {
        return this.exchange;
    }
    setExchange({ exchange, }) {
        this.exchange = exchange;
    }
}
exports.ExchangeSql = ExchangeSql;
//# sourceMappingURL=exchangeSql.js.map