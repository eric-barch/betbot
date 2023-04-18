import { ElementHandle } from 'puppeteer';

import * as localModels from '../../../local';

export class ExchangeGameTeam {
    // private properties
    private wrappedUpdateElementFunction: Function;

    // public linked objects
    public exchangeGame: localModels.ExchangeGame;
    public team: localModels.Team;
    public element: ElementHandle | null;

    // public constructor
    public constructor({
        exchangeGame,
        team,
        updateElementFunction,
    }: {
        exchangeGame: localModels.ExchangeGame,
        team: localModels.Team,
        updateElementFunction: Function,
    }) {
        this.wrappedUpdateElementFunction = updateElementFunction.bind(this);

        this.exchangeGame = exchangeGame;
        this.team = team;
        this.element = null;

        exchangeGame.exchangeGameTeams.add(this);
        team.exchangeGameTeams.add(this);
    }

    // public instance methods
    public matches({
        exchangeGame,
        team,
    }: {
        exchangeGame: localModels.ExchangeGame,
        team: localModels.Team,
    }) {
        const exchangeGameMatches = (this.exchangeGame === exchangeGame);
        const teamMatches = (this.team === team);

        if (exchangeGameMatches && teamMatches) {
            return true;
        }

        return false;
    }

    public async updateElement() {
        await this.wrappedUpdateElementFunction();
    }
}