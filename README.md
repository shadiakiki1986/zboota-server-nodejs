# zboota-server-nodejs
Rewrite of [zboota-server](https://github.com/shadiakiki1986/zboota-server) in nodejs to be deployed on AWS lambda instead of EC2.

''Zboota-server'': App backend for [zboota-app](https://github.com/shadiakiki1986/zboota-app)

''Zboota-app'': gets tickets issued by Lebanese ISF, Parkmeter lebanon, ...

# Dev notes
* Installing
 * Install aws CLI
  * http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-with-pip

    apt-get remove python-pip
    easy_install pip
    # DO NOT USE THIS BECAUSE IT's an old version that doesn't support lambda # sudo apt-get install awscli
    sudo pip install awscli
    sudo ln -s /usr/local/bin/aws /usr/bin/aws
    aws configure # enter input
    # Note if got "Unable to parse config file: http://stackoverflow.com/a/26078371

 * Install this package''s requirements
    npm install

* Testing: npm test
* Upload to AWS lambda: bash upload.sh
