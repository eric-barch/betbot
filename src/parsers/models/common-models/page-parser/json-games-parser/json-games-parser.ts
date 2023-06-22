import { Game } from '@prisma/client';

export interface SpecializedJsonGamesParser {
  ensureGamesInDb(): Promise<Array<Game>>;
}