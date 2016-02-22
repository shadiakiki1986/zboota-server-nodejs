'use strict';
var DdbManager = require('app/DdbManager');
var context={
    fail:function(err) { console.error("Shouldnt get here"); },
    succeed: function(res) {
      console.log("res",res);
    }
};
var dm = new DdbManager();
dm.revertDataDate(context);
