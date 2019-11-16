var api = "Your-API-KEY";
var googleTranslate = require('google-translate')(api);
const lineReader = require('line-reader');
const fs = require('fs');
var bodyParser = require('body-parser');
count=0;
var express = require("express");
var app = express();
const htmlToText = require('html-to-text');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

LanguageCode="LanguageCode";
Translates="Translate";

var result = [];

async function func(lang,text){
		console.log(api);
		googleTranslate.translate(text, lang, function(err, translation){
		if(err) {
		console.log("Both Api Exhausted");					 
		}
		else {
		result.push({LanguageCode: lang, Translates: translation.translatedText});
		} 
	}
);	

}

async function processArray(array,text) {
	const promises =  array.map(item => {
			 func(item,text)
	  });
	  await Promise.all(promises);
	  
	  return result;
}



app.listen(3000, () => {
 console.log("Server running on port 3000");
});


function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}


app.post('/',  async function  (req, res) {

	result = [];
	
	var langlist=req.query.target.split(',');
	
	var string=req.query.str;
	
	var formet=req.query.format;
	
	if(formet =='html'){
		console.log("here");
		string = htmlToText.fromString(string, {
		wordwrap: 130});
	}
	
	console.log(langlist);
	console.log(string);
	console.log(formet);	
	
	var result1 = await processArray(langlist,string);
	await sleep(2000);
	res.contentType('application/json');
	return res.send(JSON.stringify(result));

});