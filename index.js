console.log('Loading function');

var DdbGet=require('app/DdbGet');

// expose the handler from DdbGet
exports.handleGet = function(event, context) {
  DdbGet.handler(event,context);
};
