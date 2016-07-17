'use strict';
var DdbUserWrapper = require('app/DdbUserWrapper');
var DdbManagerWrapper = require('app/DdbManagerWrapper');

      DdbUserWrapper.login(
        { email:"put email here", pass:"put password here" },
        { fail:function(err) {
            console.error('should not get here');
          },
          succeed: function(data) {
            console.log('data11',data);
            data=JSON.parse(data);
            data=Object.keys(data).map(function(x) { return data[x]; });
            console.log('data12',data);
            DdbManagerWrapper.getNotSilent(
              data,
              { fail: function(err) {
                  console.error('Error: '+err);
                },
                succeed: function(res) {
                  console.log('data2',res);
                }
              });

          }
        }
      );
