#!/bin/bash
# http://blog.iron.io/2015/01/aws-lambda-vs-ironworker.html

zip zboota-get.zip *.js

aws lambda upload-function \
  --region us-west-2 \
  --function-name zboota-get \
  --function-zip zboota-get.zip \
  --role arn:aws:iam::886436197218:role/lambda_dynamo \
  --mode event \
  --handler index.handler \
  --runtime nodejs 
#  --debug 
#  --profile adminuser \

rm zboota-get.zip
