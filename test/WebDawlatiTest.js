'use strict';
var WebDawlati = require('app/WebDawlati');
var should = require('should');

var testWebDawlati = function(opts,expected,done) {
    WebDawlati.handler(
              opts,
              function(data) {
//                console.log(data);
                data.should.eql(expected);
                done();
              }
            );
};

describe.only('WebDawlati tests', function() {

	it('missing data', function(done) {
	    testWebDawlati({a:"B",n:"123"},"Data missing fields",done);
	});

	it('Invalid area code', function(done) {
	    testWebDawlati({a:"2",n:"138288",y:"2015",t:"Private cars",hp:"1 - 10"},
		"Invalid area code",done);
	});

	it('Invalid vehicle type', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"2015",t:"dummy",hp:"1 - 10"},
		"Invalid vehicle type",done);
	});

	it('Invalid model year', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"dummy",t:"Private cars",hp:"1 - 10"},
		"Invalid model year",done);
	});

	it('Invalid horse power', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"2015",t:"Private cars",hp:"dummy"},
		"Invalid horse power",done);
	});

	it('sample car: inspection not required', function(done) {
	    testWebDawlati({a:"B",n:"123123",y:"2015",t:"Private cars",hp:"1 - 10"},
		"325,000 LL, due in April, mandatory inspection: not required",
		done);
	});

	it('sample car: no results matching spec', function(done) {
	    testWebDawlati({'a':"M",'n':"239296",'t':"Private cars",'hp':"1 - 10",'y':"2010"},
		"There are no results matching the specifications you've entered...",
		done);
	});

});

