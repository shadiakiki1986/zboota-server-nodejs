var http=require('http'); 
var request=require('request'); // https://github.com/request/request
var should = require('should');
var xpath=require('xpath'); // https://www.npmjs.com/package/xpath
var dom = require('xmldom').DOMParser;

exports.handler = function(data,callbackFn) {
    var options = {
        url:'http://apps.isf.gov.lb/speedticket/speedticket_en.php',
        timeout:5000
    };

    request.get(options, function(err,res,body) {

if(res.statusCode!=200) { callbackFn("Not available"); return; }
//      console.log("Got response: " + res.statusCode);
//console.log("data",data);

        options.form={
	'platenumber' : data.n,
	'carCode': data.a,
	'submitted': '1',
	'Search.x': 0,
	'Search.y': 0
        };
        request.post(
            options,
            function (error, response, body) {
                if (error || response.statusCode != 200) {
                  callbackFn("Not available");
                  return;
                }

body=body
    .replace(/<\/td><\/td>/,"</td>")
    .replace(/method=post/,"method='post'")
    .replace(/<meta (.*)>/,"<meta $1 />")
    .replace(/[\n\t\r]/g,"")
    .replace(/<form.*>.*<\/form>/,"")
    .replace(/<head.*>.*<\/head>/,"")
; // correcting html

//                    console.log(body)
// http://stackoverflow.com/questions/16010551/getting-element-using-xpath-and-cheerio
var doc = new dom().parseFromString(body)
var m2 = xpath.select("//tr[@style='color:green;font-size:20px;']/td/b/text()", doc).toString()
//console.log("M1",m2,data);

	if(!m2) {
                m2 = xpath.select("//tr[@style='background-color:#E1E6EB;']/td[2]/text()", doc).toString()
	}
	m2 = m2.replace(/[\n\t\r]/g,"");
//console.log("M2",m2,data);

	// some string manipulation
	if(m2=="No violation") m2="None";

                    callbackFn(m2);
            }
        );

    }); // end request.get

};
