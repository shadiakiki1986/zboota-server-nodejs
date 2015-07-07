'use strict';
var MailManager = require('app/MailManager');
var should = require('should');

describe('MailManager tests', function() {

  it('email valid', function(done) {
	MailManager.mailValidate("shadiakiki1986@yahoo.com",
	  function(err,valid) {
            if(err) { should.fail('Error: '+err); return; }
            valid.should.eql(true);
            done();
	  }
	);
    });

  it('email invalid', function(done) {
	MailManager.mailValidate("shadiakiki1986",
	  function(err,valid) {
            if(err) { should.fail('Error: '+err); return; }
            valid.should.eql(false);
            done();
	  }
	);
    });

  it('send email valid', function(done) {
	MailManager.mailSend("shadiakiki1986@gmail.com","test","test",
	  { fail:function(err) { should.fail('Error: '+err);},
	    succeed: function(msg) {
              msg.should.eql("Queued. Thank you.");
	      done();
            }
	  }
	);
    });

  it('send email invalid', function(done) {
	MailManager.mailSend("shadiakiki1986","test","test",
	  { fail:function(err) {
              err.should.eql("Forbidden to send email. Error: 'to' parameter is not a valid address. please check documentation");
              done();
            },
	    succeed: function(msg) { should.fail("Shouldn't get here"); }
	  }
	);
    });

});
