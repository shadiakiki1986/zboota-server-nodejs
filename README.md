# zboota-server-nodejs
Rewrite of [zboota-server](https://github.com/shadiakiki1986/zboota-server) in nodejs to be deployed using AWS Lambda and AWS S3 services instead of running an AWS EC2 continuously for this.
* ''Zboota-server'': Php implementation of app backend for [zboota-app](https://github.com/shadiakiki1986/zboota-app)
* ''Zboota-app'': gets tickets issued by Lebanese ISF, Parkmeter lebanon, ...

# Requirements
* mailgun domain
  * as of 2017-03-29 I registered zboota.net in Amazon Route 53 and will set up `mg.zboota.net` as a custom domain in mailgun
* aws keys

Both of these are configured in the `config.json` file mentioned below

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
 * Note on AWS credentials:
   1. for travis-ci, AWS credentials in the nodejs code are gotten from the encrypted environmental variables in the .travis.yml file
     * check [Ref](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Environment_Variables)
   2. on a server, `aws configure` will save the access keys to `~/.aws/credentials`
     * [Ref](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html#getting-started-nodejs-configure-keys)

* `sudo apt-get install libcurl4-gnutls-dev`
* Install this package''s requirements
```
npm install
cp node_modules/app/config-sample.json node_modules/app/config.json # and edit parameters
```

Note to myself: copy the config.json parameters from the config.php file for the php-based `zboota-server`

# Testing
Note that some of the tests have to do with Mailgun, and hence require the proper settings in `node_modules/app/config.json`

Also note that `aws configure` above is important for accessing the dynamodb database

Local tests

    [sudo] ln -s /usr/bin/nodejs /usr/bin/node # http://stackoverflow.com/a/26320915/4126114
    npm test

Running a single test

    node node_modules/mocha/bin/mocha --timeout 120000 -g "mechanique from web"

or with npm 5.3.0 and the release of `npx`

    npx mocha --timeout 120000 -g "mechanique from web"

or edit the `describe` function call in the test file to be `describe.only`

Running on http://travis-ci.org
* [![Build Status](https://secure.travis-ci.org/shadiakiki1986/zboota-server-nodejs.png)](http://travis-ci.org/shadiakiki1986/zboota-server-nodejs)
* Special note for .travis.yml file: `travis encrypt 'MAILGUN\_KEY=blabla'`

# Upload to AWS
1. make sure that the settings in `node_modules/app/config.json` are all correct, especially the mailgun settings
2. edit if needed which lambda functions in `scripts/uploda.sh` are to be uploaded
3. upload with: `bash scripts/upload.sh`

# Modify the header message
* The header message is stored in a file on the S3 bucket: https://s3-us-west-2.amazonaws.com/zboota-server/headerMessage/headerMessage.txt
* It requires the bucket zboota-server to have CORS enabled (right click on zboota-server, Permissions, Edit CORS)
* To update the message, use the following (of course after configuring aws CLI ( check above installation notes for more details ) ):
```
tf=`tempfile` && echo "new message" > $tf && aws s3 cp $tf s3://zboota-server/headerMessage/headerMessage.txt --acl public-read && rm $tf
```
* To update to an empty message, just replace `"new message"` with `""`
* To check the message: `curl https://s3-us-west-2.amazonaws.com/zboota-server/headerMessage/headerMessage.txt`

# Useful snippets

    aws lambda list-functions
    aws s3 cp s3://zboota-server/zboota-server-syncAll.log .

