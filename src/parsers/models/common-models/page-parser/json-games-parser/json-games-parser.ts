import { Game } from '@prisma/client';

export interface IJsonGamesParser {
  ensureGamesInDb(): Promise<Array<Game>>;
}