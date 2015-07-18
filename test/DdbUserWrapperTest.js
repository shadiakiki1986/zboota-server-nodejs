'use strict';
var DdbUserWrapper = require('app/DdbUserWrapper');
var DdbUser = require('app/DdbUser');
var should = require('should');

var pass="dummy";

function testReset(done) {
	// drop passFail flag so as not to interfere with demo usage
	var du=new DdbUser(
	  { email:"shadiakiki1986@yahoo.com", pass:"dummy" },
	  { fail:function(err) { should.fail('Error: '+err); },
	    succeed: function() { ; } // unneeded
	  },
	  true
	);
	du.connect(function() {
          du.dropPassFail(function() {
            // set the password for other tests
            pass=du.getEntry()['pass']; 
	    done();
	  });
	});
}

describe('DdbUserWrapper login', function() {

  it('fail', function(done) {
    DdbUserWrapper.login(
      { email:"shadiakiki1986@yahoo.com", pass:"dummy" },
      { fail:function(err) {
          err.should.eql("Wrong password.");
          done();
        },
        succeed: function(data) {
          should.fail('Shouldnt get here');
        }
      }
    );
  });

  it('succeed', function(done) {
    testReset(function() {
      DdbUserWrapper.login(
        { email:"shadiakiki1986@yahoo.com", pass:pass },
        { fail:function(err) { should.fail('Error: '+err);},
          succeed: function(data) {
            data.should.eql("[]");
            done();
          }
        }
      );
    });
  });

  it('forgot password', function(done) {
    DdbUserWrapper.forgotPassword(
      { email:"shadiakiki1986@yahoo.com", pass:"dummy" },
      { fail:function(err) { should.fail('Error: '+err);},
        succeed: function(data) {
          data.should.eql("{}");
          done();
        }
      }
    );
  });

});

describe('DdbUserWrapper update', function() {

  it('fail password', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:"dummy", lpns:"[{\"a\":\"B\",\"n\":123}]" },
      { fail:function(err) {
          err.should.eql("Wrong password.");
          done();
        },
        succeed: function(data) {
          should.fail('Shouldnt get here');
        }
      }
    );
  });

  it('reset', function(done) { testReset(done); });

  it('fail missing lpns', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass },
      { fail:function(err) { err.should.eql("Missing email or pass or lpns"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('fail invalid lpns 1', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass, lpns:"[{\"bla\":\"bli\"}]" },
      { fail:function(err) { err.should.eql("Event elements should all have n and a fields"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('fail invalid lpns 2', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass, lpns:"[{\"a\":\"B\"}]" },
      { fail:function(err) { err.should.eql("Event elements should all have n and a fields"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('fail invalid lpns 3', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass, lpns:"[{\"a\":\"B\",\"n\":\"\"}]" },
      { fail:function(err) { err.should.eql("Event elements should all have n and a fields"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('pass 1', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass, lpns:"[{\"a\":\"B\",\"n\":\"123\"}]" },
      { fail:function(err) { should.fail('Error: '+err); },
        succeed: function(data) {
          data.should.eql({});
          DdbUserWrapper.login(
            { email:"shadiakiki1986@yahoo.com", pass:pass },
            { fail:function(err) { should.fail('Error: '+err); },
              succeed: function(data2) {
                data2.should.eql('[{"a":"B","n":"123"}]');
                done();
              }
            }
          );
        }
      }
    );
  });

  it('pass 2', function(done) {
    DdbUserWrapper.update(
      { email:"shadiakiki1986@yahoo.com", pass:pass, lpns:"[]" },
      { fail:function(err) { should.fail('Error: '+err); },
        succeed: function(data) {
          data.should.eql({});
          DdbUserWrapper.login(
            { email:"shadiakiki1986@yahoo.com", pass:pass },
            { fail:function(err) { should.fail('Error: '+err); },
              succeed: function(data2) {
                data2.should.eql('[]');
                done();
              }
            }
          );
        }
      }
    );
  });

});

describe('DdbUserWrapper new user (almost same as tests in DdbUser new user)', function() {

  it('invalid', function(done) {
    DdbUserWrapper.newUser(
      { email:"shadiakiki1986" },
      { fail:function(err) { err.should.eql("Invalid email shadiakiki1986"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('missing 1', function(done) {
    DdbUserWrapper.newUser(
      { },
      { fail:function(err) { err.should.eql("Missing email"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('missing 2', function(done) {
    DdbUserWrapper.newUser(
      { email: "" },
      { fail:function(err) { err.should.eql("Missing email"); done(); },
        succeed: function(data) { should.fail('Shouldnt get here'); }
      }
    );
  });

  it('already registered', function(done) {
    DdbUserWrapper.newUser(
      { email:"shadiakiki1986@yahoo.com" },
      { fail:function(err) { err.should.eql('Email address already registered.'); done(); },
        succeed: function(data) { should.fail("Shouldnt get here"); }
      }
    );
  });

  it('pass', function(done) {
    var du = new DdbUser(
      { email:"test@abc.com" },
      { fail:function(err) { should.fail("Error",err); },
        succeed: function() {
          DdbUserWrapper.newUser(
            { email:"test@abc.com" },
            { fail:function(err) { should.fail('Error: '+err); },
              succeed: function(data) {
                data.should.eql({});
                done();
              }
            }
          );
        }
      },
      true,
      true
    );
    du.delete();
  });

});

