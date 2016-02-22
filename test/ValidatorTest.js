'use strict';
var Validator = require('app/Validator');
var should = require('should');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser

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

	it('validDawlatiMechanique', function() {
      var xml = "<book><title value='1'>Harry Potter</title><title value='2'>ba2ra</title></book>"
      var doc = new dom().parseFromString(xml)
      var nodes = xpath.select("//title", doc)
      Validator.validDawlatiMechanique(nodes,"bla").isvalid.should.eql(false);
      Validator.validDawlatiMechanique(nodes,"1").isvalid.should.eql(true);
      Validator.validDawlatiMechanique(nodes,"1").list.length.should.eql(2);
	});


});

