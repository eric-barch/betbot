interface initializable {
    initialize(): Promise<void>;
}

interface getAllable {
    getAll(): any;
}

export abstract class ItemSet<T extends initializable & getAllable> extends Set<T> {
    public async initialize() {
        for (const item of this) {
            await item.initialize();
        }
    }

    add(item: T): this {
        const allItems = item.getAll();

        if (allItems) {
            if (this === allItems) {
                // Some code to add to or update MySQL.
            } else {
                allItems.add(item);
            }
        }

        return super.add(item);
    }
}