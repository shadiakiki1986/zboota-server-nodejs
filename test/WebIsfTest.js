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
	    testWebIsf({a:"2:B",n:"123"},"None",done);
	});

	it('should get B/134431 = 28/11/2014', function(done) {
	    testWebIsf({a:"2:B",n:"134431"},"28/11/2014",done);
	});

});

