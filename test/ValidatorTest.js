'use strict';
var Validator = require('app/Validator');
var should = require('should');

describe('Validator tests', function() {

	it('validArea', function() {
	    Validator.validArea("B").should.eql(true);
	    Validator.validArea("2").should.eql(false);
	    Object.keys(Validator.mapIsf()).filter(function(x) { return Object.keys(Validator.mapPml()).indexOf(x)==-1; }).length.should.eql(0);
	    Object.keys(Validator.mapPml()).filter(function(x) { return Object.keys(Validator.mapIsf()).indexOf(x)==-1; }).length.should.eql(0);
	});

	it('validNumber', function() {
	    Validator.validNumber("B").should.eql(false);
	    Validator.validNumber("2").should.eql(true);
	});

	it('mapIsf', function() {
	    Object.keys(Validator.mapIsf()).length.should.above(3);
	    Validator.mapIsf()["B"].should.not.eql("B");
	});

	it('mapPml', function() {
	    Object.keys(Validator.mapPml()).length.should.above(3);
	    Validator.mapPml()["B"].should.not.eql("B");
	});

});

