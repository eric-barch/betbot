import { ElementHandle } from 'puppeteer';

import * as localModels from '../../local';

export async function draftKings(this: localModels.ExchangeGame): Promise<ElementHandle | null> {
    this.element = null;
    return null;
}