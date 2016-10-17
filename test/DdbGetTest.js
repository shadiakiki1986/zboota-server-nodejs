'use strict';
var DdbGet = require('app/DdbGet');
var DdbManager = require('app/DdbManager');
var should = require('should');

var testDdbGet = function(opts,expected,done,isSync,outputTs) {
  var dg = new DdbGet(opts,
    { succeed:function(data) {
        var nowTs = new Date().toISOString().replace(/T/," ").replace(/\..*/,"");
        for(var d in data) {

          if(!!outputTs) {
            // check dataTs
            if(!outputTs.dataNotNow) {
              data[d].dataTs.should.eql(nowTs);
            } else {
              data[d].dataTs.should.below(nowTs);
            }
  
            data[d].hasOwnProperty("lastGetTs").should.eql(true);
            data[d].hasOwnProperty("addedTs").should.eql(true);

            if(isSync) {
              if(outputTs.addedNow) {
                data[d].lastGetTs.should.eql(nowTs);
              } else {
                data[d].lastGetTs.should.below(nowTs);
              }
            } else {
              data[d].lastGetTs.should.eql(nowTs);
            }

            if(!!outputTs.addedNow) {
              data[d].addedTs.should.eql(nowTs);
            } else {
              // added TS should be earlier than nowTs
              data[d].addedTs.should.below(nowTs);
            }

            delete data[d].lastGetTs;
            delete data[d].addedTs;
          }

          // drop dataTs and check rest
          delete data[d].dataTs;
        }

        // if expected has a key "pml", try with "Not available" also
        var exp2 = expected;
        if(Object.keys(expected).indexOf("pml")!==-1) {
          exp2.pml = "Not available";
          data.should.be.oneOf([expected,exp2]);
          done();
          return;
        }

        // check if any entries in expected also have pml and do the same
        var foundAny = false;
        for(var ei in expected) {
          if(Object.keys(expected[ei]).indexOf("pml")!==-1) {
            exp2[ei].pml = "Not available";
            foundAny = true;
          }
        }

        if(foundAny) {
          data.should.be.oneOf([expected,exp2]);
          done();
          return;
        }

        // if no pml found, just make a regular comparison
        data.should.eql(expected);
        done();
      },
      fail:should.fail
    },
    true, // silent
    isSync,
    outputTs
  );
  if(!dg.invalid) dg.get();
};

var testGetFromWeb = function(data,x0,existed,expG,expM) {
    var x = [x0];
    var dg = new DdbGet(
      x,
      { succeed:should.fail,
        fail:should.fail
      },
      true, // silent
      false, // is sync
      false // output ts
    );
    if(dg.invalid) should.fail("Shouldnt get here");
    var o = dg.getFromWeb(data,x0,existed);
    o.g.should.eql(expG);
    o.m.should.eql(expM);
};

describe('DdbGet getFromWeb', function() {

  it('no data in ddb + no mech', function() {
    testGetFromWeb(null,{"a":"B","n":"123"},false,true,false);
  });

  it('no data in ddb + mech', function() {
    var x0 = {"a":"B","n":"123","hp":"bla","t":"bla","y":"bla"};
    testGetFromWeb(null,x0,false,true,true);
  });

  it('data in ddb wo mech with today ts + no mech', function() {
    var todayD=new Date().toISOString().substr(0,10);
    var x0 = {"a":"B","n":"123","dataTs":todayD};
    testGetFromWeb({Item:x0},x0,true,false,false);
  });

  it('data in ddb wo mech with past ts + no mech', function() {
    var x0 = {"a":"B","n":"123"};
    var x1 = {"a":"B","n":"123","dataTs":"1900-01-01"};
    testGetFromWeb({Item:x1},x0,true,true,false);
  });

  it('data in ddb w mech with today ts + no mech', function() {
    var todayD=new Date().toISOString().substr(0,10);
    var x0 = {"a":"B","n":"123"};
    var x1 = {"a":"B","n":"123","dataTs":todayD,"hp":"bla","y":"bla","t":"bla"};
    testGetFromWeb({Item:x1},x0,true,false,false);
  });

  it('data in ddb w mech with today ts + mech', function() {
    var todayD=new Date().toISOString().substr(0,10);
    var x0 = {"a":"B","n":"123","hp":"bla","y":"bla","t":"bla"};
    var x1 = {"a":"B","n":"123","dataTs":todayD,"hp":"bla","y":"bla","t":"bla"};
    testGetFromWeb({Item:x1},x0,true,false,true);
  });

  it('data in ddb wo mech with today ts + mech', function() {
    var todayD=new Date().toISOString().substr(0,10);
    var x0 = {"a":"B","n":"123","hp":"bla","y":"bla","t":"bla"};
    var x1 = {"a":"B","n":"123","dataTs":todayD};
    testGetFromWeb({Item:x1},x0,true,true,true);
  });

}); // end test getFromWeb

describe('DdbGet retrieval', function() {

  it('[] in => {} out', function(done) {
    testDdbGet(
      [],
      {},
      done
    );
  });

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
                (end2-start2).should.below(1000); // test first that we're on a good connection
                (end1-start1).should.above(end2-start2);
                done();
              }
            );
          }
        );
      }
    });
  });


  it('should get B/123 fast after caching but slow with force=true', function(done) {
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
                var start3 = new Date().getTime();
                testDdbGet(
                  [{"a":"B","n":"123"}],
                  {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
                  function() {
                    var end3 = new Date().getTime();
                    //console.log("1",end1-start1,"2",end2-start2,"3",end3-start3);
                    (end1-start1).should.above(end2-start2);
                    (end3-start3).should.above(end2-start2);
                    (end2-start2).should.below(1000);
                    (end1-start1).should.above(4000);
                    (end3-start3).should.above(4000);
                    done();
                  },
                  true // force
                );
              },
              false // force
            );
          },
          false // force
        );
      }
    });
  });

});


describe('DdbGet invalid event', function() {

  it('fail on non-array not keyed by a+n', function(done) {
    var dg = new DdbGet({a:"B",n:"123"},
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { msg.should.eql("Event should be associative array keyed by area+number"); done(); }
      },
      true
    );
  });

  it('pass on non-array keyed by a+n', function() {
    var dg = new DdbGet({"B/123":{a:"B",n:"123"}},
      { succeed:function(data) { should.fail("Shouldnt get here"); },
        fail:function(msg) { should.fail("Shouldnt get here"); }
      },
      true
    );
    dg.invalid.should.eql(false);
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

  it('pass on empty non-array', function() {
    var dg = new DdbGet({},
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

  it('fail on duplicates', function(done) {
    var dg = new DdbGet([{a:"B", n: 123},{a:"B", n: 123}],
      { fail:function(err) { err.should.equal("Event should not contain duplicates"); done(); },
        succeed: function(msg) { should.fail("Shouldnt get here"); }
      },
      true
    );
    dg.invalid.should.eql(true);
  });

});  // end describe

describe('DdbGet outputTs', function() {

  it('last get + added = now', function(done) {
    new DdbManager().drop("B/123",{
      fail:should.fail,
      succeed:function() {
        testDdbGet(
          [{"a":"B","n":"123"}],
          {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
          done,
          false, // is sync
          {addedNow:true,dataNotNow:false} // expected timestamps
        );
      }
    });
  });

  it('last get = now, added = before, sync = true', function(done) {
    new DdbManager().drop("B/123",{
      fail:should.fail,
      succeed:function() {
        testDdbGet(
          [{"a":"B","n":"123"}],
          {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
          function() {
            testDdbGet(
              [{"a":"B","n":"123"}],
              {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
              done,
              true, // is sync
              {addedNow:false,dataNotNow:false} // expected timestamps
            );
          },
          false, // is sync
          {addedNow:true,dataNotNow:false} // expected timestamps
        );
      }
    });
  });

  it('last get = now, added = before, sync = false', function(done) {
    new DdbManager().drop("B/123",{
      fail:should.fail,
      succeed:function() {
        testDdbGet(
          [{"a":"B","n":"123"}],
          {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
          function() {
            setTimeout(function() {
              testDdbGet(
                [{"a":"B","n":"123"}],
                {"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
                done,
                false, // is sync
                {addedNow:false,dataNotNow:true} // expected timestamps
              );
            },
            3000); // wait 3 seconds before next check
          },
          false, // is sync
          {addedNow:true,dataNotNow:false} // expected timestamps
        );
      }
    });
  });


});

