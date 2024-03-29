CREATE OR REPLACE VIEW "odd_overview" AS 
SELECT
    l."abbreviation" AS "league_abbreviation",
    at."identifierFull" AS "away_team_identifier_full",
    ht."identifierFull" AS "home_team_identifier_full",
    g."startDate" AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York' AS "start_date_east_coast_time",
    e."name" AS "exchange_name",
    s."name" AS "statistic_name",
    o."value" AS "odd_value",
    o."price" AS "odd_price"
FROM
    "Game" g
    INNER JOIN "Team" at ON g."awayTeamId" = at."id"
    INNER JOIN "Team" ht ON g."homeTeamId" = ht."id"
    INNER JOIN "League" l ON at."leagueId" = l."id" AND ht."leagueId" = l."id"
    INNER JOIN "Statistic" s ON g."id" = s."gameId"
    INNER JOIN "Odd" o ON s."id" = o."statisticId"
    INNER JOIN "Exchange" e ON o."exchangeId" = e."id"
WHERE
    o."isVisible" = true;
