import * as databaseModels from '../../../database';
import * as globalModels from '../../../global';
import * as localModels from '../..';

export enum OutcomeType {
    SpreadAway = 'spread_away',
    SpreadHome = 'spread_home',
    MoneylineAway = 'moneyline_away',
    MoneylineHome = 'moneyline_home',
    TotalOver = 'total_over',
    TotalUnder = 'total_under'
}

export class Outcome {
    private wrappedType: OutcomeType;
    private wrappedGame: localModels.Game;
    private wrappedOdds: localModels.OddSet;
    private wrappedOppositeOutcome: Outcome | null;
    private wrappedSqlOutcome: databaseModels.Outcome | null;

    private constructor({
        type,
        game,
    }: {
        type: OutcomeType,
        game: localModels.Game,
    }) {
        this.wrappedType = type;
        this.wrappedGame = game;
        this.wrappedOdds = new localModels.OddSet();
        this.wrappedOppositeOutcome = null;
        this.wrappedSqlOutcome = null;

        game.outcomes.add(this);
        globalModels.allOutcomes.add(this);
    }

    static async create({
        type,
        game,
        oppositeOutcome,
    }: {
        type: OutcomeType,
        game: localModels.Game,
        oppositeOutcome?: Outcome,
    }): Promise<Outcome> {
        const newOutcome = new Outcome({
            type: type,
            game: game,
        });

        if (oppositeOutcome) {
            newOutcome.oppositeOutcome = oppositeOutcome;
        }

        await newOutcome.initSqlOutcome();

        return newOutcome;
    }

    public async initSqlOutcome(): Promise<databaseModels.Outcome> {
        const type = this.type;
        const gameId = this.game.sqlGame.get('id');

        await databaseModels.Outcome.findOrCreate({
            where: {
                type: type,
                gameId: gameId,
            }
        }).then(async ([sqlOutcome, created]) => {
            this.wrappedSqlOutcome = sqlOutcome;
        })

        return this.sqlOutcome;
    }

    public matches({
        type,
        game,
    }: {
        type: OutcomeType,
        game: localModels.Game,
    }) {
        const typeMatches = (this.type === type);
        const gameMatches = (this.game === game);

        if (typeMatches && gameMatches) {
            return true;
        }

        return false;
    }

    get type(): OutcomeType {
        return this.wrappedType;
    }

    get game(): localModels.Game {
        return this.wrappedGame;
    }

    get team(): localModels.Team {
        if (this.type === OutcomeType.SpreadAway ||
            this.type === OutcomeType.MoneylineAway ||
            this.type === OutcomeType.TotalOver) {
                return this.game.awayTeam;
        }
        
        if (this.type === OutcomeType.SpreadHome ||
            this.type === OutcomeType.MoneylineHome ||
            this.type === OutcomeType.TotalUnder) {
                return this.game.homeTeam;
        }

        throw new Error(`Did not find corresponding outcome team.`);
    }

    get odds(): localModels.OddSet {
        return this.wrappedOdds;
    }

    get oppositeOutcome(): Outcome {
        if (!this.wrappedOppositeOutcome) {
            throw new Error(`wrappedOppositeOutcome is null.`);
        }

        return this.wrappedOppositeOutcome;
    }

    set oppositeOutcome(oppositeOutcome: Outcome) {
        this.wrappedOppositeOutcome = oppositeOutcome;
        oppositeOutcome.wrappedOppositeOutcome = this;
    }

    get sqlOutcome(): databaseModels.Outcome {
        if (!this.wrappedSqlOutcome) {
            throw new Error(`${this.game.regionAbbrIdentifierAbbr} ${this.type} sqlOutcome is null.`)
        }

        return this.wrappedSqlOutcome;
    }
}