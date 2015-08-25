'use strict';
var Statistics = require('app/Statistics');
var should = require('should');

describe('Statistics Main', function() {

  it('get', function(done) {
    var du = new Statistics(
      { fail:function(err) { should.fail("Shouldnt get here: "+err); },
        succeed: function(data) {
          //console.log(data);
          done();
        }
      }
    );
    du.get();
  });

});


