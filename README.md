# zboota-server-nodejs
Rewrite of [zboota-server](https://github.com/shadiakiki1986/zboota-server) in nodejs to be deployed using AWS Lambda and AWS S3 services instead of running an AWS EC2 continuously for this.

''Zboota-server'': Php implementation of app backend for [zboota-app](https://github.com/shadiakiki1986/zboota-app)

''Zboota-app'': gets tickets issued by Lebanese ISF, Parkmeter lebanon, ...

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

* DO NOT USE THIS BECAUSE IT's an old version that doesn't support lambda:

    sudo apt-get install awscli

* Note if got "Unable to parse config file", check http://stackoverflow.com/a/26078371

* Install this package''s requirements

    npm install
    cp node_modues/app/config-sample.json node_modues/app/config.json # and edit parameters

# Testing

    npm install --dev
    npm test

# Upload to AWS
* lambda functions: bash upload.sh
* header message:
 * The header message is stored in a file on the S3 bucket: https://s3-us-west-2.amazonaws.com/zboota-server/headerMessage/headerMessage.txt
 * It needs to be made public on aws s3 (right-click on the folder 'headerMessage' / properties / make public)
 * Also the bucket zboota-server needs to have CORS enabled (right click on zboota-server, Permissions, Edit CORS)
 * To update the message, use the following (of course after configuring aws CLI ( check above installation notes for more details ) ):

    tf=`tempfile` && echo "new message" > $tf && aws s3 cp $tf s3://zboota-server/headerMessage/headerMessage.txt && rm $tf

