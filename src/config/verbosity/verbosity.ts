export const verbosity = {
  "config": {
    "barrelsby.json": {},
    "headless.ts": {},
    "index.ts": {},
    "verbosity": {
      "generator.js": {
        "getFileStructure": false,
        "getComponentStructure": false,
        "getClasses": false,
        "getClassIndices": false,
        "getClosingBraceIndex": false,
        "getFunctions": false
      },
      "index.ts": {},
      "verbosity.ts": {}
    }
  },
  "database": {
    "classes": {
      "index.ts": {},
      "sqlExchange.ts": {},
      "sqlGame.ts": {},
      "sqlOdds.ts": {},
      "sqlOddsHistory.ts": {},
      "sqlTeam.ts": {}
    },
    "functions.ts": {
      "close": false,
      "initialize": true,
      "makeSqlAssociations": false
    },
    "index.ts": {}
  },
  "index.ts": {},
  "initData": {
    "exchanges": {
      "exchanges.ts": {},
      "index.ts": {},
      "parseFunctions": {
        "fanDuel.ts": {
          "fanDuel": false
        },
        "index.ts": {}
      }
    },
    "index.ts": {},
    "teams": {
      "index.ts": {},
      "nbaTeams.ts": {},
      "nflTeams.ts": {}
    }
  },
  "main.ts": {},
  "models": {
    "group": {
      "allExchanges.ts": {
        "AllExchanges": {
          "constructor": false,
          "analyze": false,
          "close": false,
          "connect": false,
          "initialize": false,
          "getExchanges": false
        }
      },
      "allGames.ts": {
        "AllGames": {
          "constructor": false,
          "getGame": false,
          "getAllGames": false,
          "push": false
        }
      },
      "allOdds.ts": {
        "AllOdds": {
          "constructor": false
        }
      },
      "allTeams.ts": {
        "AllTeams": {
          "constructor": false,
          "getTeam": false,
          "setTeams": false
        }
      },
      "globalState.ts": {},
      "index.ts": {}
    },
    "index.ts": {},
    "individual": {
      "exchange": {
        "exchange.ts": {
          "Exchange": {
            "constructor": false,
            "analyze": false,
            "close": false,
            "connect": false,
            "initialize": false,
            "getName": false,
            "getNameStripped": false,
            "getNameCamelCase": false,
            "getUrl": false,
            "getPageReader": false,
            "getPageParser": false,
            "getPageWriter": false,
            "getOdds": false,
            "getCurrentOdds": false,
            "getLastSavedOdds": false,
            "setName": false,
            "setNameCamelCase": false,
            "setUrl": false,
            "setPageReader": false,
            "setPageParser": false,
            "setPageWriter": false,
            "setGames": false,
            "setOdds": false,
            "setCurrentOdds": false,
            "setLastSavedOdds": false
          }
        },
        "index.ts": {},
        "utils": {
          "abstractUtil.ts": {
            "AbstractUtility": {
              "constructor": false,
              "initialize": false,
              "saveHtml": false,
              "close": false,
              "getExchange": false,
              "getHtml": false,
              "getPage": false,
              "setHtml": false,
              "setPageContent": false
            }
          },
          "htmlScrape.ts": {
            "HtmlScrape": {
              "constructor": false,
              "getString": false,
              "getScrapedAt": false
            }
          },
          "index.ts": {},
          "utilImplementations": {
            "exchangePageParser.ts": {
              "constructor": false,
              "parse": false
            },
            "exchangePageReader.ts": {
              "connect": false,
              "scrape": false
            },
            "exchangePageWriter.ts": {},
            "index.ts": {}
          }
        }
      },
      "game": {
        "game.ts": {
          "Game": {
            "constructor": false,
            "match": false,
            "getAwayTeam": false,
            "getHomeTeam": false,
            "getStartDate": false,
            "getExchanges": false,
            "getOdds": false
          }
        },
        "index.ts": {}
      },
      "index.ts": {},
      "odds": {
        "index.ts": {},
        "odds.ts": {
          "Odds": {
            "constructor": false,
            "getGame": false,
            "getExchange": false,
            "getSpreadOdds": false,
            "getMoneyOdds": false,
            "getOverUnderOdds": false
          }
        },
        "oddsComponents": {
          "index.ts": {},
          "moneyOdds.ts": {
            "MoneyOdds": {
              "constructor": false,
              "getAwayPrice": false,
              "getHomePrice": false,
              "setAwayPrice": false,
              "setHomePrice": false
            }
          },
          "overUnderOdds.ts": {
            "OverUnderOdds": {
              "constructor": false,
              "getOverUnder": false,
              "getOverPrice": false,
              "getUnderPrice": false,
              "setOverUnder": false,
              "setOverPrice": false,
              "setUnderPrice": false
            }
          },
          "spreadOdds.ts": {
            "SpreadOdds": {
              "constructor": false,
              "getAwaySpread": false,
              "getAwayPrice": false,
              "getHomeSpread": false,
              "getHomePrice": false,
              "setAwaySpread": false,
              "setAwayPrice": false,
              "setHomeSpread": false,
              "setHomePrice": false
            }
          }
        }
      },
      "team": {
        "index.ts": {},
        "team.ts": {
          "Team": {
            "constructor": false,
            "match": false,
            "getFullName": false,
            "getRegionFull": false,
            "getRegionAbbr": false,
            "getIdentifierFull": false,
            "getIdentifierAbbr": false,
            "getAltNames": false,
            "getRegionAbbrIdentifierFull": false
          },
          "Foo": {}
        }
      }
    }
  },
  "state": {
    "globalStateObjects.ts": {},
    "index.ts": {}
  }
};