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

  it('login fail', function(done) {
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

  it('reset', function(done) { testReset(done); });

  it('login succeed', function(done) {
    DdbUserWrapper.login(
      { email:"shadiakiki1986@yahoo.com", pass:pass },
      { fail:function(err) { should.fail('Error: '+err);},
        succeed: function(data) {
          data.should.eql("{}");
          done();
        }
      }
    );
  });

});

