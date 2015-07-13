'use strict';
var DdbGet = require('app/DdbGet');
var DdbManager = require('app/DdbManager');
var should = require('should');

var testDdbGet = function(opts,expected,done) {
  var dg = new DdbGet(opts,
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
  if(!dg.invalid) dg.get();
};

describe('DdbGet retrieval', function() {

  it('should get B/123 isf and pml = None', function(done) {
    new DdbManager().drop("B/123",{
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
    new DdbManager().drop("B/123",{
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
    new DdbManager().drop("B/123",{
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
    new DdbManager().drop("B/123",{
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
    new DdbManager().drop("B/123",{
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

    new DdbManager().drop("B/123",{
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


describe('DdbGet invalid event', function() {

  it('fail on non-array', function(done) {
    var dg = new DdbGet({a:"B",n:"123"},
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Event should be array"); done(); }
      },
      true
    );
  });

  it('pass on empty array', function() {
    var dg = new DdbGet([],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { should.fail("Shouldnt get here"); }
      },
      true
    );
    dg.invalid.should.eql(false);
  });

  it('fail on missing area', function(done) {
    var dg = new DdbGet([{n:"123"}],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Event elements should all have n and a fields"); done(); }
      },
      true
    );
  });
 
  it('fail on missing number', function(done) {
    var dg = new DdbGet([{a:"B"}],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Event elements should all have n and a fields"); done(); }
      },
      true
    );
  });

  it('fail on invalid area', function(done) {
    var dg = new DdbGet([{a:123, n: 123}],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Some area fields are invalid"); done(); }
      },
      true
    );
  });

  it('fail on invalid number', function(done) {
    var dg = new DdbGet([{a:"B", n: "dummy"}],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Some number fields are invalid"); done(); }
      },
      true
    );
  });

  it('fail on incomplete context', function(done) {
    var dg = new DdbGet([{a:"B", n: 123, hp: "1 - 10"}],
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Event elements should either have all mech fields or no mech fields"); done(); }
      },
      true
    );
  });

  it('fail on incomplete context', function(done) {
    try {
      var dg = new DdbGet([{a:"B", n: 123}],
        { fail:function(msg) { should.fail("Shouldnt get here"+msg); }
        },
        true
      );
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.should.eql("Context should have succeed function");
      done();
    }
  });

  it('fail on context not a function', function(done) {
    try {
      var dg = new DdbGet([{a:"B", n: 123}],
        { fail:function(msg) { should.fail("Shouldnt get here"); },
          succeed: "abc"
        },
        true
      );
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.should.eql("Context succeed is not a function");
      done();
    }
  });

}); 
