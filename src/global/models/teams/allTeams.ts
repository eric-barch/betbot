import {
    atlantaHawks,
    bostonCeltics,
    brooklynNets,
    charlotteHornets,
    chicagoBulls,
    clevelandCavaliers,
    dallasMavericks,
    denverNuggets,
    detroitPistons,
    goldenStateWarriors,
    houstonRockets,
    indianaPacers,
    losAngelesClippers,
    losAngelesLakers,
    memphisGrizzlies,
    miamiHeat,
    milwaukeeBucks,
    minnesotaTimberwolves,
    newOrleansPelicans,
    newYorkKnicks,
    oklahomaCityThunder,
    orlandoMagic,
    philadelphia76ers,
    phoenixSuns,
    portlandTrailBlazers,
    sacramentoKings,
    sanAntonioSpurs,
    torontoRaptors,
    utahJazz,
    washingtonWizards,
} from './leagues';

import * as models from '../../../models';

class AllTeams extends models.TeamSet {
    public async init(): Promise<void> {
        this.add(atlantaHawks);
        this.add(bostonCeltics);
        this.add(brooklynNets);
        this.add(charlotteHornets);
        this.add(chicagoBulls);
        this.add(clevelandCavaliers);
        this.add(dallasMavericks);
        this.add(denverNuggets);
        this.add(detroitPistons);
        this.add(goldenStateWarriors);
        this.add(houstonRockets);
        this.add(indianaPacers);
        this.add(losAngelesClippers);
        this.add(losAngelesLakers);
        this.add(memphisGrizzlies);
        this.add(miamiHeat);
        this.add(milwaukeeBucks);
        this.add(minnesotaTimberwolves);
        this.add(newOrleansPelicans);
        this.add(newYorkKnicks);
        this.add(oklahomaCityThunder);
        this.add(orlandoMagic);
        this.add(philadelphia76ers);
        this.add(phoenixSuns);
        this.add(portlandTrailBlazers);
        this.add(sacramentoKings);
        this.add(sanAntonioSpurs);
        this.add(torontoRaptors);
        this.add(utahJazz);
        this.add(washingtonWizards);

        for (const team of this) {
            await team.init();
        }
    }
}

export const allTeams = new AllTeams();