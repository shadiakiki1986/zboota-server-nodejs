'use strict';
var WebAvailability = require('app/WebAvailability');

    var du = new WebAvailability({
          fail:function(err) { console.error("Shouldnt get here"); },
          succeed: function(res) {
            console.log("res",res);
          }
    });
    du.refresh(function() {
      du.init();
    });

