'use strict';
var WebDawlati = require('app/WebDawlati');
var should = require('should');

var testWebDawlati = function(opts,expected,done,notexact) {
    WebDawlati.handler(
              opts,
              function(data) {
//                console.log(data);
                if(notexact) {
                  data.lastIndexOf(expected).should.eql(0);
                } else {
                  data.should.eql(expected);
                }
                done();
              }
            );
};

describe('WebDawlati tests', function() {

	it('missing data', function(done) {
	    testWebDawlati({a:"B",n:"123"},"Data missing fields",done);
	});

	it('Invalid area code', function(done) {
	    testWebDawlati({a:"2",n:"138288",y:"2015",t:"Private cars",hp:"1 - 10"},
		"Invalid area code",done);
	});

	it('Invalid plate number', function(done) {
	    testWebDawlati({a:"B",n:"something",y:"2015",t:"Private cars",hp:"1 - 10"},
		"Invalid plate number",done);
	});

	it('Invalid vehicle type', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"2015",t:"dummy",hp:"1 - 10"},
		"Invalid vehicle type",done,true);
	});

	it('Invalid model year', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"dummy",t:"Private cars",hp:"1 - 10"},
		"Invalid model year",done,true);
	});

	it('Invalid horse power', function(done) {
	    testWebDawlati({a:"B",n:"138288",y:"2015",t:"Private cars",hp:"dummy"},
		"Invalid horse power",done,true);
	});

	it('sample car: inspection not required', function(done) {
	    testWebDawlati({a:"B",n:"123123",y:"2015",t:"Private cars",hp:"1 - 10"},
		"325,000 LL, due in April, mandatory inspection: not required",
		done);
	});

	it('sample car: inspection required', function(done) {
	    testWebDawlati({a:"B",n:"123123",y:"2010",t:"Private cars",hp:"11-20"},
		"120,000 LL, due in April, mandatory inspection: required",
		done);
	});

	it('sample car: no results matching spec', function(done) {
	    testWebDawlati({'a':"M",'n':"239296",'t':"Private cars",'hp':"1 - 10",'y':"2010"},
		"There are no results matching the specifications you've entered...",
		done);
	});

});

