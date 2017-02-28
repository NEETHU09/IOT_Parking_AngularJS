var fs = require("fs");
var data = fs.readFileSync('District_Wise.csv');
var stringData=data.toString();
//console.log(stringData);
var arrayOne= stringData.split('\r\n');  //\r\n is for windows format
var header=arrayOne[0].split(',');
for(i=0;i<header.length;i++)
{
  //console.log(header[i]);
}
var noOfRow=arrayOne.length;
var noOfCol=header.length;
var jsonArray=[];
var jsonArrayState=[];
var jsonArrayDistrict=[];
var i=0,j=0,k=0;

for (i = 1; i < noOfRow-1; i++)
{
  var obj = {};
  var myNewLine=arrayOne[i].split(',');

  for (j = 0; j< noOfCol; j++)
  {
    var headerText = header[j].substring(0,header[j].length);
    var valueText = myNewLine[j].substring(0,myNewLine[j].length);
    obj[headerText] = valueText;

    if(obj.Level=="State" && obj.TRU =="Total")
    {
      jsonArrayState.push(obj);
    }

    for(k=1;k<=34;k++)
    {
      if(obj.State==k)
      {
        if(obj.Level=="DISTRICT" && obj.TRU =="Total")
        {
          jsonArrayDistrict.push(obj);
        }
      }
    }
 }
 jsonArray.push(obj);
}
//console.log(jsonArrayDistrict);
fs.writeFile("data.json", JSON.stringify(jsonArray, null, 0), function(err) {
  if(err) {
      console.log(err);
      }}
);
fs.writeFile("StateNew.json", JSON.stringify(jsonArrayState, null, 0), function(err) {
  if(err) {
      console.log(err);
      }}
);
fs.writeFile("DistrictNew.json", JSON.stringify(jsonArrayDistrict, null, 0), function(err) {
  if(err) {
      console.log(err);
      }}
);
