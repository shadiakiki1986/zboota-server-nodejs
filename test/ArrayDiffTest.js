'use strict';
require('app/ArrayDiff');

describe('diff tests', function() {

  it('[1,2,3].diff([1])=[2,3]', function() {
    [1,2,3].diff([1]).should.eql([2,3]);
  });

  it('[1,2,3].diff([])=[1,2,3]', function() {
    [1,2,3].diff([]).should.eql([1,2,3]);
  });

  it('[1,2,3].diff([1,2,3])=[]', function() {
    [1,2,3].diff([1,2,3]).should.eql([]);
  });

  it('[].diff([1,2,3])=[]', function() {
    [].diff([1,2,3]).should.eql([]);
  });

}); 
