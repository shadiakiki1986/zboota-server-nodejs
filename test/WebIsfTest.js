'use strict';
var WebIsf = require('app/WebIsf');
var should = require('should');

var testWebIsf = function(opts,expected,done) {
    WebIsf.handler(
              opts,
              function(data) {
//                console.log(data);
                data.should.eql(expected);
                done();
              }
            );
};

describe('WebIsf tests', function() {

	it('should get B/123 = None', function(done) {
	    testWebIsf({a:"B",n:"123"},"None",done);
	});

	it('should get B/134431 = 28/11/2014', function(done) {
	    testWebIsf({a:"B",n:"134431"},"28/11/2014",done);
	});

	it('should get 2/134431 = Invalid area code', function(done) {
	    testWebIsf({a:"2",n:"134431"},"Invalid area code",done);
	});

});

