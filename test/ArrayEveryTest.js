'use strict';
require('app/ArrayEvery');

describe('every tests', function() {

  it('all true => true', function() {
    [true,true,true].every().should.eql(true);
  });

  it('any false => false', function() {
    [true,true,false,true].every().should.eql(false);
  });

  it('all false => false', function() {
    [false,false,false].every().should.eql(false);
  });

  it('empty => true', function() {
    [].every().should.eql(true);
  });


}); 
