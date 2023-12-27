# BetBot

Scrape and save odds and pricing data from online sports betting exchanges.

## Use Case

Online sports betting platforms have exploded in the United States in recent years. As the number of sportsbooks grows, a unique phenomenon emerges: different books offer different prices on the exact same underlying event. [DraftKings](https://sportsbook.draftkings.com/) might charge you more than [FanDuel](https://sportsbook.fanduel.com/) to bet on [the Falcons blowing a 28-3 lead over the Patriots](https://en.wikipedia.org/wiki/Super_Bowl_LI), for example. This discrepancy can sometimes lead to what's known as an arbitrage opportunity, a situation where a bettor can wager on all possible outcomes of an event across different platforms, guaranteeing a risk-free profit regardless of the result.

BetBot pulls data from several popular online sportsbooks at ~100ms resolution and saves them to a database. Then you can analyze the data to identify trends and develop high-level betting strategies. See [disclaimer](#disclaimer) below about betting on live data.

## Setup

Making BetBot a standalone application is a priority, but not yet a reality. Setup is fairly involved and requires coordinating several separate applications on your machine.

1. Set up and run a [dockerized local instance of Supabase](https://supabase.com/docs/guides/self-hosting/docker) on your machine.

   **Note:** BetBot will not work with a Supabase-hosted instance of Supabase on the free tier because the write frequency is too high.

2. Clone this repo.
3. Run `npx prisma migrate dev --name init` in the root directory. This will migrate the Prisma schema to Supabase's underlying PostgreSQL instance.
4. If you don't have [Chrome](https://www.google.com/chrome/), install it. Then run it with remote debugging open on port 9222. On Mac, you can do this by running `open -a "Google Chrome.app" --args --remote-debugging-port=9222` in Terminal.

   **Note:** Using Chromium instead of Chrome often triggers anti-webscraping security mechanisms. BetBot works best when linked to the same exact Chrome instance that you use to browse the web as a human.

5. Run `npm start` from the root directory. The script should connect to your open instance of Chrome, open the sportsbook websites automatically, continuously poll them, and save the time series data to your database.

## View and Edit the Database

BetBot is a webscraper. Its job is to get the data from the web to your database. It is just a script that runs in Node; there is no frontend. You do, however, have a few options for viewing and manipulating the scraped data in a GUI:

### Using Supabase Studio (Recommended)

Supabase provides an easy-to-use, web-based GUI called [Supabase Studio](https://supabase.com/blog/supabase-studio). To access it, simply open a browser and go to http://localhost:54323 while your local instance is running.

### Using pgAdmin

Every Supabase instance is built on top of a PostgreSQL instance. [pgAdmin](https://www.pgadmin.org/) is the free and open source GUI for PostgreSQL. If you prefer to interact with the PostgreSQL database directly, follow these steps:

1. Install pgAdmin on your machine.
2. Register a new server using the details specific to your local instance of Supabase. The default details are as follows unless you manually overrode them at some point during setup:

- Host name/address: localhost
- Port: 54322
- Username: postgres
- Password: postgres

3. You should now be able to interact with the Supabase-hosted PostgreSQL instance directly through pgAdmin, just like you would any normal PostgreSQL database.

## Disclaimer

While sportsbooks can't prevent you from gathering publicly available data, acting on that data is another matter. Placing bets requires an account with their service, and signing up involves agreeing to their terms and conditions. These terms invariably prohibit the use of automated tools to inform betting decisions. Using this bot to actually _place_ bets constitutes a violation of the terms set by the sportsbook, breaching the contract you agreed to and potentially exposing you to legal action. **Do not do this.** This project is an exercise in programming and data analysis, not a get-rich-quick scheme.
