import { initAllExchanges, initAllTeams } from './models';

export async function init(): Promise<void> {
    await initAllExchanges();
    await initAllTeams();
}