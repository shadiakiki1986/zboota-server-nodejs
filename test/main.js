'use strict';
var webIsf = require('../webIsf.js');
var should = require('should');

var testWebIsf = function(opts,expected,done) {
    webIsf.handler(
              opts,
              function(data) {
//                console.log(data);
                data.should.eql(expected);
                done();
              }
            );
};

describe('zboota-server-nodejs', function() {

	it('should get B/123 = None', function(done) {
	    testWebIsf({a:"2:B",n:"123"},"None",done);
	});

	it('should get B/134431 = 28/11/2014', function(done) {
	    testWebIsf({a:"2:B",n:"134431"},"28/11/2014",done);
	});

});

