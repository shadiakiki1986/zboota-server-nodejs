'use strict';
var webIsf = require('../webIsf.js');
var should = require('should');

describe('zboota-server-nodejs', function() {

	it('should get ISF data correctly', function() {
	    webIsf.handler(
              {a:"B",n:"123"},
              function(data) {
                console.log(data);
                data.a.should.eql("B");
                data.n.should.eql("B");
                data.isf.should.eql("None");
              },
              function(error) {
                should.fail('Should not be called');
              }
            );

	});
});

