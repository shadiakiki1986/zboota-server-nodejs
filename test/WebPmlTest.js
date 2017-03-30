'use strict';
var WebPml = require('app/WebPml');
var should = require('should');

var testWebPml = function(opts,expected,done) {
    WebPml.handler(
              opts,
              function(data) {
//                console.log(data);
                data.should.eql(expected);
                done();
              }
            );
};

describe('WebPml tests', function() {

	it('should get B/1234 = None', function(done) {
	    testWebPml({a:"B",n:"1234"},"None",done);
	});

	it('should get B/123 = 60,000', function(done) {
	    testWebPml({a:"B",n:"123"},"60000 LBP",done);
	});

	it('should get 2/138288 = Invalid area code', function(done) {
	    testWebPml({a:"2",n:"138288"},"Invalid area code",done);
	});

	it('Invalid plate number', function(done) {
	    testWebPml({a:"B",n:"something"},"Invalid plate number",done);
	});

});

