#!/bin/bash
# http://blog.iron.io/2015/01/aws-lambda-vs-ironworker.html
# Usage: from root directory: bash scripts/upload.sh
#
# Note: Make sure that the upsert function calls at the end of the file are not commented out

if [ ! -d scripts ]; then
  echo "Please use this script from the root folder"
  echo "Usage bash scripts/upload.sh"
  echo "Note: Make sure that the upsert function calls at the end of the file are not commented out"
  exit
fi

# bash string alphabetical order comparison:
# http://stackoverflow.com/a/32006346/4126114
if [ "`aws --version 2>&1 |awk -F" " '{print $1}'|awk -F\/ '{print $2}'`" \< "1.7.46" ]; then
  echo "Min aws version required 1.7.46"
  exit
fi

# cannot have grep FunctionName line below with this # set -e

echo "Zipping"
zip -q -r zboota-server-nodejs.zip *

# only in aws-cli/1.6.5 Python/2.7.3 Linux/3.2.0-29-generic-pae
#aws lambda upload-function \
#  --region us-west-2 \
#  --function-name zboota-get \
#  --function-zip zboota-server-nodejs.zip \
#  --role arn:aws:iam::886436197218:role/lambda_dynamo \
#  --mode event \
#  --handler node_modules/app/DdbManager.getNotSilent \
#  --runtime nodejs
#  --timeout 30
##  --debug 
##  --profile adminuser \

echo "Copying to s3"
aws s3 cp zboota-server-nodejs.zip s3://zboota-server/lambda-zip/zboota-server-nodejs.zip

echo "Upserting"
upsertFunction() {
  aws lambda list-functions | grep "function:$1" > /dev/null
  if [ $? == 0 ]; then
    echo "Updating function $1"
    aws lambda update-function-code \
      --function-name $1 \
      --s3-bucket zboota-server \
      --s3-key lambda-zip/zboota-server-nodejs.zip > /dev/null
    
    aws lambda update-function-configuration \
      --function-name $1 \
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description "$3" \
      --timeout 30 > /dev/null
  else
    echo "Creating function $1"
    aws lambda create-function \
      --function-name $1 \
      --runtime nodejs \
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description "$3" \
      --timeout 30 \
      --code S3Bucket="zboota-server",S3Key="lambda-zip/zboota-server-nodejs.zip" > /dev/null
  fi
}

upsertFunction "zboota-get"   "DdbManagerWrapper.getNotSilent" "Zboota: Gets zboota of user's cars"
#upsertFunction "zboota-login" "DdbUserWrapper.login" "Zboota: Login of user to get list of cars"
#upsertFunction "zboota-forgotPassword" "DdbUserWrapper.forgotPassword" "Zboota: Emails password to user"
#upsertFunction "zboota-update" "DdbUserWrapper.update" "Zboota: updates list of cars of user"
#upsertFunction "zboota-newUser" "DdbUserWrapper.newUser" "Zboota: creates new user from email"
## upsertFunction "zboota-sync"   "DdbManagerWrapper.sync" "Zboota: Sync registered user data"
#upsertFunction "zboota-regMinDate"   "DdbManagerWrapper.registeredUsersDataMinDate" "Zboota: Registered user data min date"
#upsertFunction "zboota-testUserPassword"   "DdbManagerWrapper.testUserPassword" "Zboota: Test user's password"
#upsertFunction "zboota-statistics"   "StatisticsWrapper.get" "Zboota: Get statistics"
#upsertFunction "zboota-webavailability"   "WebAvailabilityWrapper.get" "Zboota: Web availability"

# Cleaning up
rm zboota-server-nodejs.zip
aws s3 rm s3://zboota-server/lambda-zip/zboota-server-nodejs.zip
