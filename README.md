# betbot

wishlist

quick (< 1 day):
x split all findOrCreates into synchronous 'find' and asynchronous'findOrCreate'. these should all 
  exist in 'Set', not in 'AllWhatevers'.
x ensure all sets have find and findOrCreate methods
x confirm json games with document content
x get rid of rounding for start time. instead, take the first one found as THE start time and 
  compare all subsequent found startTimes to confirm they are within a certain interval of that.
- see if possible to add normal getters and setters to the abstract classes (as opposed to 
  getExchange(), for example). If possible, remove getters and setters outright
- initialize program objects to stored database values if available. program should NOT set db value
  to null and then update back to original value at initialization. this would cause future issues
  with logging data over time.
- add odd histories to track changes over time in the database
- create database class for arbs and log over time
- open new pages automatically if they don't exist in the browser
- open browser automatically if not open

priority:
- delete objects from sets when no longer relevant (complete for arbs)
- write unit tests
- periodically re-'initialize' the objects that are currently initialized only at the start of main
- ensure that everywhere findOrCreate is called makes sense. where possible, replace with just find.
- have sugarhouse adapt when columns disappear

eventually:
- parallelize for loops
- eliminate duplication in arb checking
- refactor: look for parallels between similar classes (like the 'Set's) and see if possible to
  reduce duplication
- reduce number of properties that can be set to null
- reduce number of functions that can return null
- convert class that should be singletons to singletons
- clean up import statements
- program should open tabs if not open

fun:
- add MLB
- add NHL
- add NFL
- add other leagues
- add Pinnacle Sportsbook
- add other books

high-level/long-term:
- add ability to tee up a set of bets from the program
- add support for expected value betting (as opposed to just arbitrage)
- add support for other bet types (e.g. player props, parlays)
- run continuously in remote environment







Launch Chrome with: 
Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check

Use this Terminal command to find MySQL config files:
sudo find / -name my.cnf -print 2>/dev/null

MySQL config files currently located at:
/System/Volumes/Data/opt/homebrew/etc/my.cnf
/System/Volumes/Data/opt/homebrew/Cellar/mysql/8.0.31_1/.bottle/etc/my.cnf
/opt/homebrew/etc/my.cnf
/opt/homebrew/Cellar/mysql/8.0.31_1/.bottle/etc/my.cnf