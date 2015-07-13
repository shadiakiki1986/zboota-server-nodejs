'use strict';
var DdbManager = require('app/DdbManager');
var should = require('should');

describe('DdbManager tests', function() {

  it('drop => not exists', function(done) {
    var dm = new DdbManager();
    dm.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        dm.exists(
          "B/123",
          { fail:function(err) { should.fail('Error: '+err);},
            succeed:function(res) {
              res.should.eql(false);
              done();
            }
          });
      }
    });
  });

  it('cycle: drop, not exists, get, exists', function(done) {
    var dm = new DdbManager();
    dm.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        dm.exists(
          "B/123",
          { fail:function(err) { should.fail('Error: '+err);},
            succeed:function(res) {
              res.should.eql(false);
              dm.get(
                [{"a":"B","n":"123"}],
                { fail: function(err) { should.fail('Error: '+err);},
                  succeed: function() {
                    dm.exists(
                      "B/123",
                      { fail:function(err) { should.fail('Error: '+err); },
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

