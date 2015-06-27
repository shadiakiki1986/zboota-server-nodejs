console.log('Loading function');

var webIsf=require('webIsf');
var doc = require('dynamodb-doc');
var dynamo = new doc.DynamoDB();

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    data2={};
    
    for(var i=0;i<event.length;i++) {
        x=event[i];
        dynamo.getItem({
            "TableName":"zboota-cars",
            "Key":{"id":x.a+"/"+x.n}
        }, function(err,data) {
            if(Object.keys(data).length==0) {
                console.log("Not found");
                data=webIsf.handler(x);
            } else {            
                // update last get timestamp
                data=data.Item;
            }
            delete data.lastGetTs;
            delete data.l;
            delete data.addedTs;
            
            id=data.id;
            delete data.id;
            data2[id]=JSON.parse(JSON.stringify(data));
            if(Object.keys(data2).length==event.length) context.succeed(data2);

        });
    }
  
};
