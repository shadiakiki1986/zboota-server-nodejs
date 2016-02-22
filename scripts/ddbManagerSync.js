'use strict';
var DdbManager = require('app/DdbManager');
var context={
    fail:function(err) { console.error("Shouldnt get here"); },
    succeed: function(res) {
      ; //do nothing // console.log("res",res);
    }
};
var dm = new DdbManager();
dm.syncDdbWeb(context);
