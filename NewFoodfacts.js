var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var inputFile = 'FoodFacts.csv';
var outputFile = 'outputFoodFacts.json';
var inputStream = fs.createReadStream(inputFile);
var outputStream = new stream;
var rl = readline.createInterface(inputStream, outputStream);

var indexArray = [];
var valueArray = [];
var indexObj = {};
var outputArray = [];
var countries = ["Netherlands", "Canada", "United Kingdom","United States", "Australia", "France", "Germany", "Spain", "South Africa"];
var i=1;

rl.on('line', function(data)
{
  if(i==1)
  {
    indexArray=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    // console.log(indexArray);
  }
  else
  {
    valueArray=data.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    sugarSaltConsumptionObject(valueArray);
    //console.log(valueArray);
  }
    i++;
})

rl.on('close', function()
{
    console.log(outputArray);
    console.log(outputArray.length);

  fs.writeFile(outputFile, JSON.stringify(outputArray));
  console.log('End of File');
})

function sugarSaltConsumptionObject(rowArray)
{
  if(countries.indexOf(rowArray[33])>-1 && Boolean(rowArray[102]) && Boolean(rowArray[116]))
  {
    var temp = {};
    temp["countries"] = rowArray[33];
    temp["sugar"] = rowArray[102];
    temp["salt"] = rowArray[116];
    outputArray.push(temp);
  }
}

//Sugar + Salt Consumption according to countries
var fs = require("fs");
var d;
var inFile = "outputFoodFacts.json";
var res = [];
var obj = {};
var obj1={};
var temp ={};
var countryArr = ["United Kingdom","France","Germany","United States","Australia","Spain","Netherlands","South Africa","Canada"];
var mean = [1,1,1,1,1,1,1,1,1];
fs.readFile(inFile, function (err, data) {
  if (err) throw err;
  data = data.toString();
  d = JSON.parse(data);

  for (var i = 0, len = d.length; i < len; i++) {
       var o = d[i]["countries"];
        var sugar = parseInt(d[i]["sugar"]);
        var salt = parseInt(d[i]["salt"]);
        if (obj.hasOwnProperty(o)) {
          var m = countryArr.indexOf(o);
           mean[m] = mean[m]+1;
            obj[o] = parseInt(obj[o]) + sugar;
            obj1[o] = parseInt(obj1[o])+ salt;
        }
        else {
            obj[o] = sugar;
            obj1[o] = salt;
        }     }
 console.log(obj);
 console.log(obj1);
 console.log("count of Netherlands: "+mean[5]);
  for (var v in obj) {
    if (obj.hasOwnProperty(v)) {
     var temp ={};
      temp["country_name"] = v;
      var index =countryArr.indexOf(v);
      temp["Sugar"] = obj[v]/mean[index];
      temp["Salt"] = obj1[v]/mean[index];
      console.log(temp);
      res.push(temp);

    }   }
  fs.writeFile("newFilterFoodFacts.json", JSON.stringify(res), function (err) {
      if (err) throw err;
  })
});
