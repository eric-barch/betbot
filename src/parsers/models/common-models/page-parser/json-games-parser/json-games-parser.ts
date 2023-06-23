import { Game } from '@prisma/client';

export interface SpecializedJsonGamesParser {
  games: Array<Game>;
}