'use strict';
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

describe('DdbUser login', function() {

  it('reset', function(done) { testReset(done); });

  it('login', function(done) {
    var du = new DdbUser(
      { email:"shadiakiki1986@yahoo.com", pass:pass },
      { fail:function(err) { should.fail('Error: '+err);},
        succeed: function() {
          du.getEntry().hasOwnProperty("lpns").should.eql(true);
          done();
        }
      },
      true
    );
    du.loginCore();
  });

  it('account fail flag is incremented', function(done) {
	var du = new DdbUser(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
              var du2=new DdbUser(
                {email:"shadiakiki1986@yahoo.com",pass:"dummy"},
                { fail:function(err) { should.fail('Error: '+err);},
                  succeed: function() { ; }
                },
                true
              );
              du2.connect(function() {
                var ee=du2.getEntry();
                ee.hasOwnProperty("passFail").should.eql(true);
                ee.passFail.should.eql(1);
                done();
              });
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
	  },
	  true
	);
	du.loginCore();
  });

  it('fail flag is dropped after a successful login', function(done) {
	var du = new DdbUser(
	  { email: "shadiakiki1986@yahoo.com", pass: pass },
	  { fail: function(err) { should.fail("Shouldn't get here"); },
	    succeed: function() {
              var du2=new DdbUser(
                { email:"shadiakiki1986@yahoo.com", pass:"dummy" },
                { fail:function(err) { should.fail('Error: '+err);},
                  succeed: function() { ; }
                },
                true
              );
              du2.connect(function() {
                var ee=du2.getEntry();
                ee.hasOwnProperty("passFail").should.eql(false);
                done();
              });
 	    }
	  },
	  true
	);
        du.loginCore();
  });

  it('account is locked after 3? failed attempts', function(done) {
        var n=0;
	var du = new DdbUser(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
              n++;
	      if(n<=5) {
                err.should.eql("Wrong password.");
                du.loginCore();
              } else {
                err.should.eql("Account locked.");
                done();
              }
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
        du.loginCore();
  });

  it('reset 2', function(done) { testReset(done); });

});


describe('DdbUser new', function() {

  it('new user existing', function(done) {
	var du = new DdbUser(
	  { email:"shadiakiki1986@yahoo.com" },
	  { fail:function(err) {
              err.should.eql('Email address already registered.');
              done();
            },
	    succeed: function() { should.fail('Shouldnt get here'); }
	  },
	  true
	);
        du.newUser();
    });

//  it('dummy',function(done) { setTimeout(done,6000); });

  it('new user inexistant', function(done) {
	var du = new DdbUser(
	  { email:"test@abc.com" },
	  { fail:function(err) { should.fail("Error",err); },
	    succeed: function() {
              du.context.succeed=done;
              du.newUser();
            }
	  },
	  true
	);
        du.delete();
    });
});
