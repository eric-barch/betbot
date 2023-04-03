import { allExchangesInit, allTeamsInit } from "./models";

export async function init(): Promise<void> {
    await allExchangesInit();
    await allTeamsInit();
}