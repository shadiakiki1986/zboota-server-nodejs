'use strict';
var WebAvailabilityWrapper = require('app/WebAvailabilityWrapper');
var should = require('should');

describe('WebAvailabilityWrapper', function() {

  it('get', function(done) {
    WebAvailabilityWrapper.get({},{
          fail:function(err) { should.fail("Shouldnt get here"); },
          succeed: function(res) {
            res.hasOwnProperty("isf", res);
            res.hasOwnProperty("pml", res);                               
            res.hasOwnProperty("dawlati", res);                                      
//            res.should.eql(true == is_bool(res["isf"]));                                          
//            res.should.eql(true == is_bool(res["dawlati"]));                                      
//            res.should.eql(true == is_bool(res["pml"]));
            done();
          }
    });
  });

});

