import { allPages } from '../all-pages';
import { IGlobal } from '../i-global';

import * as db from '../../db';

class AllGames implements IGlobal<db.models.Game> {
  private wrappedActive: Array<db.models.Game>;

  constructor() {
    this.wrappedActive = new Array<db.models.Game>();
  }

  public async init(): Promise<Array<db.models.Game>> {
    for (const page of allPages.active) {
      const pageParser = await page.getPageParser();

      const pageGames = await pageParser.getGames();

      for (const pageGame of pageGames) {
        this.wrappedActive.push(pageGame);
      }
    }

    return this.wrappedActive;
  }

  get active(): Array<db.models.Game> {
    return this.wrappedActive;
  }
}

export const allGames = new AllGames();
