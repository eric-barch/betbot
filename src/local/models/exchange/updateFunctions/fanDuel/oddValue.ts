import * as localModels from '../../../../../local';

export const map = new Map<string, Function>([
    ['spread_over', spreadOver],
    ['spread_under', spreadUnder],
    ['moneyline_away', moneylineAway],
    ['moneyline_home', moneylineHome],
    ['total_over', totalOver],
    ['total_under', totalUnder],
]);

export async function spreadOver() {
    console.log('Run spreadOver.');
}

export async function spreadUnder() {
    console.log('Run spreadUnder.');
}

export async function moneylineAway() {
    console.log('Run moneylineAway.');
}

export async function moneylineHome() {
    console.log('Run moneylineHome.');
}

export async function totalOver() {
    console.log('Run totalOver.');
}

export async function totalUnder() {
    console.log('Run totalUnder.');
}