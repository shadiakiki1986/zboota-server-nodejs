'use strict';
var DdbGet = require('app/DdbGet');
var should = require('should');

var testDdbGet = function(opts,expected,done) {
    DdbGet.handler(
              opts,
              {
                succeed:function(data) {
                  // check dataTs
                  var todayD=new Date().toISOString().substr(0,10);
                  for(var d in data) { data[d].dataTs.substr(0,10).should.eql(todayD); }

                  // drop dataTs and check rest
                  for(var d in data) { delete data[d].dataTs; }
                  data.should.eql(expected);

                  done();
                },
                fail:function(error) {
                   should.fail('Error: '+error);
                }
              }
            );
};

describe('DdbGet tests', function() {

	it('should get B/123 = None', function(done) {
            DdbGet.drop("B/123",{
              fail:function(err) { should.fail('Error: '+error);},
              succeed:function() {
                DdbGet.exists("B/123",{
                   fail:function(err) { should.fail('Error: '+error);},
                   succeed:function(res) {
                     res.should.eql(false);

                     testDdbGet([{"a":"B","n":"123"}],
             		{"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
             		function() {
			    DdbGet.drop("B/123",{
			      fail:function(err) { should.fail('Error: '+error);},
			      succeed:done
                            });
                        });
             
                  }
                });
	      }
	   });
    	});

	it('should get B/123 = None and B/134431 = 28/11/2014', function(done) {
                DdbGet.exists("B/134431",{
                   fail:function(err) { should.fail('Error: '+error);},
                   succeed:function(res) {
                     res.should.eql(true);

        	     testDdbGet(
                        [ {"a":"B","n":"123"},
                          {a:"B",n:"134431"}
                        ],
        		{ "B/123":{"a":"B","n":"123","isf":"None","pml":"None"},
                          "B/134431":{"a":"B","n":"134431","isf":"28/11/2014","pml":"None",
                                      "dm": "325,000 LL, due in April, mandatory inspection: not required",
                                      "hp": "1 - 10", "photoUrl": "f_Yt9PvO", "t": "Private cars", "y": "2015"}
                        },
             		function() {
			    DdbGet.drop("B/123",{
			      fail:function(err) { should.fail('Error: '+error);},
			      succeed:done
                            });
                        });
             
                  }
                });

	});

	it('should get B/123 faster after caching', function(done) {

            DdbGet.drop("B/123",{
              fail:function(err) { should.fail('Error: '+error);},
              succeed:function() {

var start1 = new Date().getTime();

                     testDdbGet([{"a":"B","n":"123"}],
             		{"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
             		function() {
var end1 = new Date().getTime();

                DdbGet.exists("B/123",{
                   fail:function(err) { should.fail('Error: '+error);},
                   succeed:function(res) {
                     res.should.eql(true);

var start2 = new Date().getTime();
                     testDdbGet([{"a":"B","n":"123"}],
             		{"B/123":{"a":"B","n":"123","isf":"None","pml":"None"}},
             		function() {
var end2 = new Date().getTime();

                            (end1-start1).should.above(end2-start2);
                            (end2-start2).should.below(1000);

			    DdbGet.drop("B/123",{
			      fail:function(err) { should.fail('Error: '+error);},
			      succeed:done
                            });
                        });
             
                  }
                });
	      });
           }
         });
      });


});

