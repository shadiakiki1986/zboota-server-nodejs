#!/bin/bash
# Generates php config file from environment variables
# Output to be put into config.php in the zboota-server-nodejs node_modules/app folder
#
# export ZBOOTA_SERVER_AWS_KEY=123
# export ZBOOTA_SERVER_AWS_ACCESS=123

if [ -z "$MAILGUN_KEY" ]; then echo "Please set env vars. Check scripts/env2conf.sh"; exit -1; fi
if [ -z "$MAILGUN_DOMAIN" ]; then echo "Please set env vars. Check scripts/env2conf.sh"; exit -1; fi
if [ -z "$MAILGUN_FROM" ]; then echo "Please set env vars. Check scripts/env2conf.sh"; exit -1; fi
if [ -z "$MAILGUN_PUBLIC_KEY" ]; then echo "Please set env vars. Check scripts/env2conf.sh"; exit -1; fi

echo "{"
echo "\"MAILGUN_KEY\":\"$MAILGUN_KEY\","
echo "\"MAILGUN_DOMAIN\":\"$MAILGUN_DOMAIN\","
echo "\"MAILGUN_FROM\":\"$MAILGUN_FROM\","
echo "\"MAILGUN_PUBLIC_KEY\":\"$MAILGUN_PUBLIC_KEY\","
echo "\"ZBOOTA_SERVER_AWS_REGION\":\"us-east-1\"," #us-east-1 is only for travis-ci. Use us-west-2 in the production config.json file
echo "\"MAX_PASS_FAIL\": 5"
echo "}"

