# 2016-02-22
* replace the sync from php with sync from nodejs
 * think of what the max time limit of a lambda function is,
 * split the number of unupdated registered cars into small batches that meet the time limit,
 * have a batch launch the next batch when done.
 * also consider sending the emails, backing up the server, ... (whatever is on the cron on zboota-server EC2 instance)

# 2016-02-21
* How does the zboota-server front-page show that PML is working but when I run WebAvailability on PML I get that it is not available?
 * a manual test shows that indeed it is not up now
 * replace my manual ping with usage of isitup.org on the front page
  * https://isitup.org/www.parkmeterlebanon.com
