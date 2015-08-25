'use strict';
var StatisticsWrapper = require('app/StatisticsWrapper');
var should = require('should');

describe('Statistics Wrapper', function() {

  it('get', function(done) {
    StatisticsWrapper.get(
      {},
      { fail:function(err) { should.fail("Shouldnt get here: "+err); },
        succeed: function(data) {
          //console.log(data);
          done();
        }
      }
    );
  });

});

