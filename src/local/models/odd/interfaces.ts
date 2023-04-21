import { ElementHandle } from "puppeteer";

import * as localModels from '../../../local';

export interface OddFactory {
    createSpreadAway(): SpreadAway;
    createSpreadHome(): SpreadHome;
    createMoneylineAway(): MoneylineAway;
    createMoneylineHome(): MoneylineHome;
    createTotalOver(): TotalOver;
    createTotalUnder(): TotalUnder;
}

export interface SpreadAway {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}

export interface SpreadHome {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}

export interface MoneylineAway {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}

export interface MoneylineHome {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}

export interface TotalOver {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}

export interface TotalUnder {
    updateElements(): Promise<{
        priceElement: ElementHandle | null,
        valueElement: ElementHandle | null,
    }>;
}