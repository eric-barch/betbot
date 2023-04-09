import { Odd } from "./odd";

import * as localModels from '../../../local';

export class OddSet extends Set {
    public async update() {
        for (const odd of this) {
            await odd.update();
        }
    }
}