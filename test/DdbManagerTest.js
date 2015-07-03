'use strict';
var DdbManager = require('app/DdbManager');
var should = require('should');

describe('DdbManager tests', function() {

  it('drop => not exists', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+error);},
      succeed:function() {
        DdbManager.exists(
          "B/123",
          { fail:function(err) { should.fail('Error: '+error);},
            succeed:function(res) {
              res.should.eql(false);
              done();
            }
          });
      }
    });
  });

  it('cycle: drop, not exists, get, exists', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+error);},
      succeed:function() {
        DdbManager.exists(
          "B/123",
          { fail:function(err) { should.fail('Error: '+error);},
            succeed:function(res) {
              res.should.eql(false);
              DdbManager.get(
                [{"a":"B","n":"123"}],
                { fail: function(err) { should.fail('Error: '+error);},
                  succeed: function() {
                    DdbManager.exists(
                      "B/123",
                      { fail:function(err) { should.fail('Error: '+error); },
                        succeed:function(res) { res.should.eql(true); done(); }
                      });
                  }
                });
            }
          });
      }
    });
  });

});

