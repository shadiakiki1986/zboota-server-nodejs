'use strict';
require('app/ArrayUnique');

describe('unique tests', function() {

  it('[1,2,2,1] => [1,2]', function() {
    [1,2,1].unique().should.eql([1,2]);
  });

  it('[1,2] => [1,2]', function() {
    [1,2].unique().should.eql([1,2]);
  });

  it('[] => []', function() {
    [].unique().should.eql([]);
  });

  it('[{a:..,n:..},{a:..,n:..}] => [...]', function() {
    [ { a: 'B', n: 123 }, { a: 'B', n: 123 } ].unique().should.eql([ { a: 'B', n: 123 } ]);
  });

}); 
