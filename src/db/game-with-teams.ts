import { Prisma } from '@prisma/client';

export type GameWithTeams = Prisma.GameGetPayload<{
  include: { awayTeam: true, homeTeam: true };
}>;