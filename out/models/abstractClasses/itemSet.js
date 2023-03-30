"use strict";
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
exports.ItemSet = void 0;
class ItemSet extends Set {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of this) {
                yield item.initialize();
            }
        });
    }
    add(item) {
        const allItems = item.getAll();
        if (allItems) {
            if (this === allItems) {
                // Some code to add to or update MySQL.
            }
            else {
                allItems.add(item);
            }
        }
        return super.add(item);
    }
}
exports.ItemSet = ItemSet;
//# sourceMappingURL=itemSet.js.map