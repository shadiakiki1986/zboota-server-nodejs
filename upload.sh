#!/bin/bash
# http://blog.iron.io/2015/01/aws-lambda-vs-ironworker.html

set -e

zip -q -r zboota-get.zip *

# only in aws-cli/1.6.5 Python/2.7.3 Linux/3.2.0-29-generic-pae
#aws lambda upload-function \
#  --region us-west-2 \
#  --function-name zboota-get \
#  --function-zip zboota-get.zip \
#  --role arn:aws:iam::886436197218:role/lambda_dynamo \
#  --mode event \
#  --handler node_modules/app/DdbManager.getNotSilent \
#  --runtime nodejs
#  --timeout 30
##  --debug 
##  --profile adminuser \

aws s3 cp zboota-get.zip s3://zboota-server/lambda-zip/zboota-get.zip

aws lambda update-function-code \
  --function-name zboota-get \
  --s3-bucket zboota-server \
  --s3-key lambda-zip/zboota-get.zip

aws lambda update-function-configuration \
  --function-name zboota-get \
  --role arn:aws:iam::886436197218:role/lambda_dynamo \
  --handler node_modules/app/DdbManager.getNotSilent \
  --description "Gets zboota of user's cars" \
  --timeout 30

rm zboota-get.zip
