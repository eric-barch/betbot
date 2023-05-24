import { DraftKingsNbaGamesPageParser } from '../../../../../src/parsers/exchange-models/draft-kings/games-page';
import { JsonGamesParser } from '../../../../../src/parsers/exchange-models/draft-kings/games-page/shared-models/json-games-parser';
import { DocumentGamesParser } from '../../../../../src/parsers/exchange-models/draft-kings/games-page/shared-models/document-games-parser';

jest.mock(
  '../../../../../src/parsers/exchange-models/draft-kings/games-page/shared-models/json-games-parser'
);
jest.mock(
  '../../../../../src/parsers/exchange-models/draft-kings/games-page/shared-models/document-games-parser'
);

describe('DraftKingsNbaGamesPageParser', () => {
  let draftKingsNbaGamesPageParser: DraftKingsNbaGamesPageParser;

  const mockJsonGames = [
    {
      id: 1,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      awayTeamId: 1,
      homeTeamId: 2,
    },
    {
      id: 2,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      awayTeamId: 3,
      homeTeamId: 4,
    },
    {
      id: 3,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      awayTeamId: 5,
      homeTeamId: 6,
    },
  ];
  const mockDocumentGames = [
    {
      id: 1,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      awayTeamId: 1,
      homeTeamId: 2,
    },
    {
      id: 2,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      awayTeamId: 3,
      homeTeamId: 4,
    },
  ];

  beforeEach(() => {
    // @ts-ignore
    JsonGamesParser.mockImplementation(() => {
      return {
        getGames: jest.fn().mockResolvedValue(mockJsonGames),
      };
    });

    // @ts-ignore
    DocumentGamesParser.mockImplementation(() => {
      return {
        getGames: jest.fn().mockResolvedValue(mockDocumentGames),
      };
    });

    draftKingsNbaGamesPageParser = new DraftKingsNbaGamesPageParser();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getGames', () => {
    it('should return games from documentGamesParser', async () => {
      const games = await draftKingsNbaGamesPageParser.getGames();
      expect(games).toEqual(mockDocumentGames);
    });

    it('should not return games that are returned from jsonGamesParser but not from documentGamesParser', async () => {
      const games = await draftKingsNbaGamesPageParser.getGames();

      // The game with id 3 is in jsonGamesParser but not in documentGamesParser
      const gameNotInDocumentGames = mockJsonGames.find((game) => game.id === 3);
      expect(games).not.toContainEqual(gameNotInDocumentGames);
    });
  });
});
