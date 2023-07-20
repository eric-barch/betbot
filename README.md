# BetBot
A webscraper that pulls live odds from popular sports betting websites.

## Setup
BetBot is not yet a self-contained application. To run it on your local machine, you must configure it to work with local instances of Chrome and your preferred Prisma-compatible database. It was developed with PostgreSQL.

To run it locally on your machine:

1. Create a '.env' file in your root directory to link Prisma to your database. Include your database URL, e.g. `DATABASE_URL="postgresql://[username]:[password]@localhost:5432/[database_name]?schema=public"`
2. Run `npx prisma migrate dev --name init`. This will migrate the Prisma schema to your local database.
3. Run Chrome with remote debugging open on port 9222. On Mac, run `open -a "Google Chrome.app" --args --remote-debugging-port=9222` in Terminal.
4. Run the script in `main.ts` by running `npm start` from the root directory. The script should connect to your open instance of Chrome and continuously update the odds in your database.