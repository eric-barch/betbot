import * as classes from '../classes';
import { verbosity } from '../_config/verbosity';

const verbose = verbosity.state;

export let exchanges = new classes.exchanges.AllExchanges();
verbose ? console.log(`state.exchanges created.`) : null;

export let games = new classes.games.AllGames();
verbose ? console.log(`state.games created.`) : null;

export let odds = new classes.odds.AllOdds();
verbose ? console.log(`state.odds created.`) : null;

export let teams = new classes.teams.AllTeams();
verbose ? console.log(`state.teams created.`) : null;