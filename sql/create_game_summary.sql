CREATE OR REPLACE VIEW "game_summary" AS 
SELECT
    l."abbreviation" AS "league_abbreviation",
    at."regionAbbr" AS "away_team_region_abbreviation",
    at."identifierFull" AS "away_team_identifier_full",
    ht."regionAbbr" AS "home_team_region_abbreviation",
    ht."identifierFull" AS "home_team_identifier_full",
    g."startDate" AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York' AS "start_date_east_coast_time",
    s."name" AS "statistic_name",
    o."price" AS "odd_price",
    o."value" AS "odd_value",
    s."id" AS "statistic_id"
FROM
    "Game" g
    INNER JOIN "Team" at ON g."awayTeamId" = at."id"
    INNER JOIN "Team" ht ON g."homeTeamId" = ht."id"
    INNER JOIN "League" l ON at."leagueId" = l."id" AND ht."leagueId" = l."id"
    INNER JOIN "Statistic" s ON g."id" = s."gameId"
    INNER JOIN "Odd" o ON s."id" = o."statisticId"
ORDER BY 
    "league_abbreviation",
    "start_date_east_coast_time",
    "away_team_region_abbreviation",
    "statistic_id";
