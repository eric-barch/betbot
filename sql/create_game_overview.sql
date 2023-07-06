CREATE OR REPLACE VIEW "game_overview" AS 
SELECT
    l."abbreviation" AS "league_abbreviation",
    at."regionAbbr" AS "away_team_region_abbr",
    at."identifierFull" AS "away_team_identifier_full",
    ht."regionAbbr" AS "home_team_region_abbr",
    ht."identifierFull" AS "home_team_identifier_full",
    g."startDate" AT TIME ZONE 'UTC' AT TIME ZONE 'America/New_York' AS "start_date_new_york_time",
    g."createdBy" AS "created_by"
FROM
    "Game" g
    INNER JOIN "Team" at ON g."awayTeamId" = at."id"
    INNER JOIN "Team" ht ON g."homeTeamId" = ht."id"
    INNER JOIN "League" l ON at."leagueId" = l."id" AND ht."leagueId" = l."id";