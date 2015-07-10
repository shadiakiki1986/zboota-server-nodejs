'use strict';
var DdbGet = require('app/DdbGet');
var DdbManager = require('app/DdbManager');
var should = require('should');

var testDdbGet = function(opts,expected,done) {
  DdbGet.init(opts,
    { succeed:function(data) {
        // check dataTs
        var todayD=new Date().toISOString().substr(0,10);
        for(var d in data) { data[d].dataTs.substr(0,10).should.eql(todayD); }

        // drop dataTs and check rest
        for(var d in data) { delete data[d].dataTs; }
        data.should.eql(expected);
        done();
      },
      fail:should.fail
    },
    true
  );
  DdbGet.get();
};

describe('DdbGet retrieval', function() {

  it('should get B/123 isf and pml = None', function(done) {
    DdbManager.drop("B/123",{
      fail:should.fail,
      succeed:function() {
        testDdbGet(
          [{"a":"B","n":"123"}],
          {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
          done
        );
      }
    });
  });

  it('should get B/123 = None and B/134431 = 28/11/2014', function(done) {
        testDdbGet(
          [ {"a":"B","n":"123"},
            {a:"B",n:"134431"}
          ],
          { "B/123":{"a":"B","n":"123","isf":"None","pml":"None"},
            "B/134431":{"a":"B","n":"134431","isf":"28/11/2014","pml":"None"}
          },
          done
        );
  });

  it('mechanique from web', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err); done(); },
      succeed:function() {
        testDdbGet(
          [        {a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015"}],
          {"B/123":{a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015", isf:"None", pml:"None", dm: "There are no results matching the specifications you\'ve entered..."}},
          done
        );
      }
    });
  });

  it('mechanique from cache', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        testDdbGet(
          [        {a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015"}],
          {"B/123":{a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015", isf:"None", pml:"None", dm: "There are no results matching the specifications you\'ve entered..."}},
          function() {
            testDdbGet(
              [ { "n": "123", "a": "B", "l": "test", "isf": "None", "pml": "None", "hp": "1 - 10", "y": "2015", "t": "Private cars" } ],
              {"B/123":{a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015", isf:"None", pml:"None", dm: "There are no results matching the specifications you\'ve entered..."}},
              done
            );
          }
        );
      }
    });
  });

}); // end describe



describe('DdbGet consistency', function() {

  it('mechanique from cache after late addition of mech info', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        testDdbGet(
          [        {a:"B", n:"123"}],
          {"B/123":{a:"B", n:"123", isf:"None", pml:"None"}},
          function() {
            testDdbGet(
              [ { "n": "123", "a": "B", "l": "test", "isf": "None", "pml": "None", "hp": "1 - 10", "y": "2015", "t": "Private cars" } ],
              {"B/123":{a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015", isf:"None", pml:"None", dm: "There are no results matching the specifications you\'ve entered..."}},
              done
            );
          }
        );
      }
    });
  });

  it('mechanique info dropped should not include mech result even if in cache', function(done) {
    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        testDdbGet(
          [ { "n": "123", "a": "B", "l": "test", "isf": "None", "pml": "None", "hp": "1 - 10", "y": "2015", "t": "Private cars" } ],
          {"B/123":{a:"B", n:"123", hp:"1 - 10", t:"Private cars", y:"2015", isf:"None", pml:"None", dm: "There are no results matching the specifications you\'ve entered..."}},
          function() {
            testDdbGet(
              [ { "n": "123", "a": "B", "l": "test" } ],
              {"B/123":{a:"B", n:"123", isf:"None", pml:"None"}},
              done
            );
          }
        );
      }
    });
  });

}); // end describe



describe('DdbGet speed', function() {

  it('should get B/123 faster after caching', function(done) {

    DdbManager.drop("B/123",{
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        var start1 = new Date().getTime();
        testDdbGet(
          [{"a":"B","n":"123"}],
          {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
          function() {
            var end1 = new Date().getTime();
            var start2 = new Date().getTime();
            testDdbGet([{"a":"B","n":"123"}],
              {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
              function() {
                var end2 = new Date().getTime();
                (end1-start1).should.above(end2-start2);
                (end2-start2).should.below(1000);
                done();
              }
            );
          }
        );
      }
    });
  });


});

