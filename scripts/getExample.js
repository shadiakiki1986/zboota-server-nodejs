'use strict';
var DdbManagerWrapper = require('app/DdbManagerWrapper');

DdbManagerWrapper.getNotSilent(
  [{"a":"B","n":"123"}],
  { fail: function(err) {
      console.error('Error: '+err);
    },
    succeed: function(res) {
      console.log(res);
    }
  });

