'use strict';
var DdbUser = require('app/DdbUser');
var should = require('should');

var pass="dummy";

function testReset(done) {
	// drop passFail flag so as not to interfere with demo usage
	DdbUser.init(
	  { email:"shadiakiki1986@yahoo.com", pass:"dummy" },
	  { fail:function(err) { should.fail('Error: '+err); },
	    succeed: function() { ; } // unneeded
	  },
	  true
	);
	DdbUser.connect(function() {
          DdbUser.dropPassFail(function() {
            // set the password for other tests
            pass=DdbUser.getEntry()['pass']; 
	    done();
	  });
	});
}

describe('DdbUser login', function() {

  it('reset', function(done) { testReset(done); });

  it('login', function(done) {
	DdbUser.loginCore(
	  { email:"shadiakiki1986@yahoo.com", pass:pass },
	  { fail:function(err) { should.fail('Error: '+err);},
	    succeed: function() {
              DdbUser.getEntry().hasOwnProperty("lpns").should.eql(true);
	      done();
            }
	  },
	  true
	);
    });

  it('account fail flag is incremented', function(done) {
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
              DdbUser.init(
                {email:"shadiakiki1986@yahoo.com",pass:"dummy"},
                { fail:function(err) { should.fail('Error: '+err);},
                  succeed: function() { ; }
                },
                true
              );
              DdbUser.connect(function() {
                var ee=DdbUser.getEntry();
                ee.hasOwnProperty("passFail").should.eql(true);
                ee.passFail.should.eql(1);
                done();
              });
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
	  },
	  true
	);
  });

  it('fail flag is dropped after a successful login', function(done) {
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: pass },
	  { fail: function(err) { should.fail("Shouldn't get here"); },
	    succeed: function() {
              DdbUser.init(
                {email:"shadiakiki1986@yahoo.com",pass:"dummy"},
                { fail:function(err) { should.fail('Error: '+err);},
                  succeed: function() { ; }
                },
                true
              );
              DdbUser.connect(function() {
                var ee=DdbUser.getEntry();
                ee.hasOwnProperty("passFail").should.eql(false);
                done();
              });
 	    }
	  },
	  true
	);
  });

  it('account is locked after 3? failed attempts', function(done) {
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Wrong password.");
	DdbUser.loginCore(
	  { email: "shadiakiki1986@yahoo.com", pass: "0000" },
	  { fail: function(err) {
	      err.should.eql("Account locked.");
              done();
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
 	    },
	    succeed: function() { should.fail("Shouldn't get here"); }
          }, true);
  });

  it('reset 2', function(done) { testReset(done); });

});


describe.only('DdbUser new', function() {

  it('new user existing', function(done) {
	DdbUser.init(
	  { email:"shadiakiki1986@yahoo.com" },
	  { fail:function(err) { err.should.eql('Email address already registered.'); done(); },
	    succeed: function() { should.fail('Shouldnt get here'); }
	  },
	  true
	);
        DdbUser.newUser(function() { should.fail('Shouldnt get here'); });
    });

  it('new user inexistant', function(done) {
	DdbUser.init(
	  { email:"test@abc.com" },
	  { fail:function(err) { should.fail("Error",err); },
	    succeed: function() { should.fail('Shouldnt get here'); }
	  },
	  true
	);
        DdbUser.newUser(function() { done(); });
    });


});
