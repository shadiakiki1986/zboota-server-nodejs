#!/bin/bash
# http://blog.iron.io/2015/01/aws-lambda-vs-ironworker.html

set -e

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

aws s3 cp zboota-server-nodejs.zip s3://zboota-server/lambda-zip/zboota-server-nodejs.zip
upsertFunction() {
  aws lambda list-functions|grep "\"FunctionName\": \"$1\""
  if [ $? == 0 ]; then
    echo "Updating function $1"
    aws lambda update-function-code \
      --function-name $1 \
      --s3-bucket zboota-server \
      --s3-key lambda-zip/zboota-server-nodejs.zip
    
    aws lambda update-function-configuration \
      --function-name $1 \
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description "Gets zboota of user's cars" \
      --timeout 30
  else
    echo "Creating function $1"
    aws lambda create-function \
      --function-name $1 \
      --run-time nodejs
      --role arn:aws:iam::886436197218:role/lambda_dynamo \
      --handler node_modules/app/$2 \
      --description $3 \
      --timeout 30 \
      --code S3Bucket="zboota-server",S3Key="lambda-zip/zboota-server-nodejs.zip"
  fi
}

upsertFunction "zboota-get"   "DdbManager.getNotSilent" "Gets zboota of user's cars"
upsertFunction "zboota-login" "DdbUserWrapper.login" "Login of user to get list of cars"

rm zboota-server-nodejs.zip
aws s3 rm s3://zboota-server/lambda-zip/zboota-server-nodejs.zip
