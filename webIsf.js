var http=require('http'); 
var request=require('request');

exports.handler = function(data,successFn,errorFn) {
    var options={
         host:'http://apps.isf.gov.lb',
         path: '/speedticket/speedticket_en.php'
    };

    http.get(options, function(res) {
      console.log("Got response: " + res.statusCode);

        var fields = {
	'platenumber' : event.n,
	'carCode': event.a,
	'submitted': '1',
	'Search.x': 0,
	'Search.y': 0
        };

        request.post(
            options.host+options.path,
            { form: fields },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                    successFn({
                         "id":event.a+"/"+event.n,
                         "a":event.a,
                         "n":event.n,
                         "isf":"Test none",
                         "lastGetTs":"bla",
                         "l":"bla",
                         "addedTs":"bla"
                    });
                } else {
                  errorFn("Error or status code not 200");
                }
            }
        );

    }).on('error', function(e) {
      console.log("Got error: " + e.message);
      errorFn(e.message);
    });




};
