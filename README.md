# BetBot
A webscraper that pulls live odds from popular sports betting websites.

## Setup
BetBot is not yet a self-contained application. To run it on your local machine, you must configure it to interact with you local instance of Chrome. To run it locally on your machine:

1. Make sure you are running a local instance of Supabase using Docker.
2. Run `npx prisma migrate dev --name init`. This will migrate the Prisma schema to Supabase's PostgreSQL instance.
3. Run Chrome with remote debugging open on port 9222. On Mac, run `open -a "Google Chrome.app" --args --remote-debugging-port=9222` in Terminal.
4. Run `npm start` from the project's root directory. The script should connect to your open instance of Chrome and continuously update the odds in your database.

## Interacting with the Database
You can view and edit data in the database with a PostgreSQL client like pgAdmin or with Supabase's studio.

### pgAdmin
* Register a new server in pgAdmin using the details specific to your local instance of Supabase.
* Default details are:
  - Host name/address: localhost
  - Port: 54322
  - Username: postgres
  - Password: postgres
* You will then be able to interact with the Supabase-hosted PostgreSQL instance through pgAdmin, just like you would a vanilla locally hosted instance of PostgreSQL.

### Supabase Studio
* Your local instance of Supabase is available to view and edit via Supabase Studio on port 54323.
* To access Studio, open a browser and go to http://localhost:54323.