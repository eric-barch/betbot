"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractItemGroup = void 0;
class AbstractItemGroup {
    constructor({ items, } = {}) {
        if (items) {
            this.items = items;
        }
        else {
            this.items = new Set;
        }
    }
    add({ item, }) {
        this.items.add(item);
    }
    getItems() {
        return this.items;
    }
    getSize() {
        return this.items.size;
    }
}
exports.AbstractItemGroup = AbstractItemGroup;
//# sourceMappingURL=abstractItemGroup.js.map