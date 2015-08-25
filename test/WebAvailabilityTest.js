'use strict';
var WebAvailability = require('app/WebAvailability');
var should = require('should');

describe.only('WebAvailability main', function() {

  it('ping', function(done) {
    var wa = new WebAvailability({
      fail:function(err) { should.fail("Shouldnt get here"); },
      succeed: function(res) { should.fail("Shouldnt get here"); }
    });

    wa.ping("http://www.google.com",function(x1) {
      x1.should.eql(true);
      wa.ping("http://randomserverthatdoesntexist.com",function(x2) {
        x2.should.eql(false);
        wa.ping("http://www.google.com",function(x3) {
          x3.should.eql(false);
          done();
        },1/1000/1000);// very small timeout should fail
      });
    });

  });

  it('res', function(done) {
    var du = new WebAvailability({
          fail:function(err) { should.fail("Shouldnt get here"); },
          succeed: function(res) {
            res.hasOwnProperty("isf");
            res.hasOwnProperty("pml");                               
            res.hasOwnProperty("dawlati");                                      
//            res.should.eql(true == is_bool(res["isf"]));                                          
//            res.should.eql(true == is_bool(res["dawlati"]));                                      
//            res.should.eql(true == is_bool(res["pml"]));
            done();
          }
    });
    du.init();
  });

});

