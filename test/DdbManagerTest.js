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
                { fail: function(err) {
                    should.fail('Error: '+err);
                  },
                  succeed: function() {
                    dm.exists(
                      "B/123",
                      { fail:function(err) {
                          should.fail('Error: '+err);
                        },
                        succeed:function(res) {
                          res.should.eql(true);
                          done();
                        }
                      });
                  }
                });
            }
          });
      }
    });
  });

  it('list Cars', function(done) {
    var dm = new DdbManager();
    dm.listCars({
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function(data) {
        data.length.should.above(1); // 500 on us-west-2, 3 on us-east-1
        done();
      }
    });

  });

  it('list Users + User Cars', function(done) {
    var dm = new DdbManager();
    dm.listUsers({
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function(dataUsers) {
        dataUsers.length.should.above(1); // 100 on us-west-2, 22 on us-east-1
        dm.listUserCars({
          fail:function(err) { should.fail('Error: '+err);},
          succeed:function(dataCars) {
            dataCars.length.should.above(0); // 100 on us-west-2, 0 on us-east-1
            dataCars.length.should.above(dataUsers.length);
            done();
          }
        });
    
      }
    });

  });

}); // end describe


describe('DdbManager data checks', function() {

  it('no duplicates', function(done) {
    var dm = new DdbManager();
        dm.listCars({
          fail:function(err) { should.fail('Error: '+err);},
          succeed:function(cars) {
            var carIds=cars.map(function(x) { return x.a+"/"+x.n; });
            carIds.length.should.eql(carIds.unique().length);
            done();
          }
        });
  });

  it('wierd ids', function(done) {
    var dm = new DdbManager();
        dm.listCars({
          fail:function(err) { should.fail('Error: '+err);},
          succeed:function(cars) {
            cars=cars.filter(function(x) { return x.a+"/"+x.n!=x.id; });
            cars.length.should.eql(0);
            done();
          }
        });
  });

});

/*
// Check https://github.com/shadiakiki1986/zboota-server-nodejs/issues/2
describe.only('DdbManager sync', function() {

  it('sync', function(done) {
    var dm = new DdbManager();
    dm.syncDdbWeb({
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function() {
        dm.listCars({
          fail:function(err) { should.fail('Error: '+err);},
          succeed:function(cars) {
            dm.listUserCars({
              fail:function(err) { should.fail('Error: '+err);},
              succeed:function(userCars) {
                var userCarIds=userCars.map(function(x) { return x.a+"/"+x.n; });
                cars=cars.filter(function(x) { return userCarIds.indexOf(x.a+"/"+x.n)!=-1; });
                var minDate = cars.map(function(x) {
                  return x.dataTs.substring(0,10);
                }).reduce(function(a,b) { if(a<b) return a; else return b; },"9999-99-99");
                var todayD=new Date().toISOString().substr(0,10);
                minDate.should.eql(todayD);
                done();
              }
            });
          }
        });
      }
    });
  });

  it('min date', function(done) {
    var dm = new DdbManager();
    dm.listCars({
      fail:function(err) { should.fail('Error: '+err);},
      succeed:function(cars) {
        dm.listUserCars({
          fail:function(err) { should.fail('Error: '+err);},
          succeed:function(userCars) {
            var userCarIds=userCars.map(function(x) { return x.a+"/"+x.n; });
            cars=cars.filter(function(x) { return userCarIds.indexOf(x.a+"/"+x.n)!=-1; });
            var minDate = cars.map(function(x) {
              return x.dataTs.substring(0,10);
            }).reduce(function(a,b) { if(a<b) return a; else return b; },"9999-99-99");
            var todayD=new Date().toISOString().substr(0,10);
            minDate.should.eql(todayD);
            done();
          }
        });
      }
    });
  });
*/

});
