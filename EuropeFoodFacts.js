var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var inputFile = 'FoodFacts.csv';
var outputFile = 'EuropeFoodFacts.json';
var inputStream = fs.createReadStream(inputFile);
var outputStream = new stream;
var rl = readline.createInterface(inputStream, outputStream);

var indexArray = [];
var valueArray = [];
var indexObj = {};
var outputArray = [];
var North_Europe   = ["United Kingdom", "Denmark", "Sweden", "Norway"];
var Central_Europe = ["France", "Belgium", "Germany", "Switzerland", "Netherlands"];
var South_Europe   = ["Portugal", "Greece", "Italy", "Spain", "Croatia", "Albania"];
var Europe         = North_Europe.concat(Central_Europe, South_Europe);
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
  if(Europe.indexOf(rowArray[33])>-1 && Boolean(rowArray[65]) && Boolean(rowArray[112]) && Boolean(rowArray[101]))
  {
    var temp = {};
    temp["countries"] = rowArray[33];
    temp["fat"] = rowArray[65];
    temp["protein"] = rowArray[112];
    temp["carbohydrate"] = rowArray[101];
    outputArray.push(temp);
    //console.log(outputArray);
  }

  // if(North_Europe.indexOf(rowArray[33])>-1 && Boolean(rowArray[65]) && Boolean(rowArray[112]) && Boolean(rowArray[101]))
  // {
  //   var tempN = {};
  //   tempN["countries"] = rowArray[33];
  //   tempN["fat"] = rowArray[65];
  //   tempN["protein"] = rowArray[112];
  //   tempN["carbohydrate"] = rowArray[101];
  //   outputArray.push(tempN);
  // }
}

//Fat, Protein, carbohydrate Consumption
var fs = require("fs");
var d;
var inFile = "EuropeFoodFacts.json";
var res = [];
var obj = {};
var obj1 = {};
var obj2 ={};
var temp ={};
//var EuropeArray         = North_Europe.concat(Central_Europe, South_Europe);
var EuropeArray = ["Norway", "United Kingdom", "Denmark", "Sweden", "France", "Belgium", "Germany", "Switzerland", "Netherlands", "Portugal", "Greece", "Italy", "Spain", "Croatia", "Albania"];
var mean = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

fs.readFile(inFile, function (err, data) {
  if (err) throw err;
  data = data.toString();
  d = JSON.parse(data);
 // console.log(d[0]["Table Name"]);
// var count = 1;
  for (var i = 0, len = d.length; i < len; i++) {
       var o = d[i]["countries"];
        var fat = parseInt(d[i]["fat"]);
        var protein = parseInt(d[i]["protein"]);
        var carbohydrate = parseInt(d[i]["carbohydrate"]);
        if (obj.hasOwnProperty(o)) {
          var m = EuropeArray.indexOf(o);
           mean[m] = mean[m]+1;
            obj[o] = parseInt(obj[o]) + fat;
            obj1[o] = parseInt(obj1[o]) + protein;
            obj2[o] = parseInt(obj2[o]) + carbohydrate;
        }
        else {
            obj[o] = fat;
            obj1[o] = protein;
            obj2[o] = carbohydrate;
        }     }
  console.log(obj);
  console.log(obj1);
  console.log(obj2);

  for (var v in obj) {
    if (obj.hasOwnProperty(v)) {
     var temp ={};
      temp["country_name"] = v;
      var index =EuropeArray.indexOf(v);
      temp["Fat"] = obj[v]/mean[index];
      temp["Protein"] = obj1[v]/mean[index];
      temp["Carbohydrate"] = obj2[v]/mean[index];
      console.log(temp);
      res.push(temp);

    }   }
  fs.writeFile("newFilterEurope.json", JSON.stringify(res), function (err) {
      if (err) throw err;
  })
});
