import { initAllExchanges, initAllTeams } from './models';

export async function init(): Promise<void> {
    await initAllTeams();
    await initAllExchanges();
}