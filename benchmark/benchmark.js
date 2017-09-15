
var labelgun = require("../lib/labelgun.min.js");


var hideLabel = function(){ return false; };
var showLabel = function(){ return true; };
var iterations = 190;

var start = new Date();

for (var j=0; j < iterations; j++) {
  var labelEngine = new labelgun.default(hideLabel, showLabel, 12);
  var boundingBox;  
  var n = 1000;

  for (var i=0; i < n; i++) {
        
    boundingBox = {
      bottomLeft : [0, 0],
      topRight   : [1.0, 1.0]
    };

    labelEngine.ingestLabel(
      boundingBox,
      i, //id
      parseInt(Math.random() * (5 - 1) + 1), // Weight
      {}, // label object
      "Test",
      false
    );

  }

  labelEngine.update();

}


var finish = new Date();
console.log( ((finish - start) / iterations) + " milliseconds");