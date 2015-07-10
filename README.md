# zboota-server-nodejs
Rewrite of [zboota-server](https://github.com/shadiakiki1986/zboota-server) in nodejs to be deployed using AWS Lambda and AWS S3 services instead of running an AWS EC2 continuously for this.
* ''Zboota-server'': Php implementation of app backend for [zboota-app](https://github.com/shadiakiki1986/zboota-app)
* ''Zboota-app'': gets tickets issued by Lebanese ISF, Parkmeter lebanon, ...

# Installing
* Install aws CLI
 * http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-with-pip
```
apt-get remove python-pip
easy_install pip
sudo pip install awscli
sudo ln -s /usr/local/bin/aws /usr/bin/aws
aws configure
```
 * Do not use this because it's an old version that doesn't support lambda: `sudo apt-get install awscli`
 * Note if got "Unable to parse config file", check http://stackoverflow.com/a/26078371

* Install this package''s requirements
```
npm install
cp node_modues/app/config-sample.json node_modues/app/config.json # and edit parameters
```
* Note on AWS credentials: for travis-ci, AWS credentials in the nodejs code are gotten from the encrypted environmental variables in the .travis.yml file
 * check http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Environment_Variables

# Testing
Local tests
```
npm install --dev
npm test
```
Running on http://travis-ci.org
* [![Build Status](https://secure.travis-ci.org/shadiakiki1986/zboota-server-nodejs.png)](http://travis-ci.org/shadiakiki1986/zboota-server-nodejs)
* Special note for .travis.yml file: `travis encrypt 'MAILGUN_KEY=blabla'`

# Upload to AWS
* lambda functions: `bash scripts/upload.sh`
* header message:
 * The header message is stored in a file on the S3 bucket: https://s3-us-west-2.amazonaws.com/zboota-server/headerMessage/headerMessage.txt
 * It requires the bucket zboota-server to have CORS enabled (right click on zboota-server, Permissions, Edit CORS)
 * To update the message, use the following (of course after configuring aws CLI ( check above installation notes for more details ) ):
```
tf=`tempfile` && echo "new message" > $tf && aws s3 cp $tf s3://zboota-server/headerMessage/headerMessage.txt --acl public-read && rm $tf
```
 * To update to an empty message, just replace `"new message"` with `""`
