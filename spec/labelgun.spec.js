var labelgun = require("../lib/labelgun");

describe("labelgun", function() {

  it("should import correctly", function(){
    
    expect(labelgun).not.toBeUndefined(); 
    expect(labelgun).not.toBeNull(); 

  });

  it("should accept hide and show functions in constructor", function(){

    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    expect(labelEngine.hideLabel()).toBe(false);
    expect(labelEngine.showLabel()).toBe(true); 

  });

  it("should accept hide and show functions in constructor", function(){

    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    expect(labelEngine.hideLabel()).toBe(false);
    expect(labelEngine.showLabel()).toBe(true); 

  });

  it("should ingest a single label", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    var boundingBox = {
      bottomLeft : [0.0, 0.0],
      topRight   : [1.0, 1.0]
    };

    labelEngine.ingestLabel(
      boundingBox,
      0, //id
      1, // Weight
      {}, // label object
      "Test",
      false
    );

    expect(labelEngine.tree.all().length).toBe(1);
    expect(Object.keys(labelEngine.allLabels).length).toBe(1);
    
  });

  it("should fail if there is no bounding box", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    var boundingBox = null;

    expect(function(){
      labelEngine.ingestLabel(
        boundingBox,
        0, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );
    }).toThrow(
      new Error("Bounding box must be defined with bottomLeft and topRight properties")
    );

    expect(labelEngine.tree.all().length).toBe(0);
    expect(Object.keys(labelEngine.allLabels).length).toBe(0);
    
  });

  it("should fail if there is a bounding box but it is incorrectly defined", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    var boundingBox = {
      bottomLeft : null,
      topRight   : null
    };

    expect(function(){
      labelEngine.ingestLabel(
        boundingBox,
        0, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );
    }).toThrow(
      new Error("Bounding box must be defined with bottomLeft and topRight properties")
    );

    expect(labelEngine.tree.all().length).toBe(0);
    expect(Object.keys(labelEngine.allLabels).length).toBe(0);
    
  });

  it("should remove a single label", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    var boundingBox = {
      bottomLeft : [0.0, 0.0],
      topRight   : [1.0, 1.0]
    };

    labelEngine.ingestLabel(
      boundingBox,
      0, //id
      1, // Weight
      {}, // label object
      "Test",
      false
    );

    labelEngine.removeLabel(0);

    expect(labelEngine.tree.all().length).toBe(0);
    expect(Object.keys(labelEngine.allLabels).length).toBe(0);
    
  });

  it("should allow for the getting of a single label", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);

    var boundingBox = {
      bottomLeft : [0.0, 0.0],
      topRight   : [1.0, 1.0]
    };

    labelEngine.ingestLabel(
      boundingBox,
      0, //id
      1, // Weight
      {}, // label object
      "Test",
      false
    );

    expect(labelEngine.tree.all().length).toBe(1);
    expect(Object.keys(labelEngine.allLabels).length).toBe(1);
    expect(typeof labelEngine.getLabel(0)).toBe("object");
    expect(labelEngine.getLabel(0).id).toBe(0);
    
  });

  it("should ingest many labels (10)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {
      
      boundingBox = {
        bottomLeft : [i, i],
        topRight   : [i + 1.0, i + 1.0]
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

    expect(labelEngine.tree.all().length).toBe(10);
    expect(Object.keys(labelEngine.allLabels).length).toBe(10);
  
  });

  it("should return the total shown and hidden correctly", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {
      
      boundingBox = {
        bottomLeft : [1, 1],
        topRight   : [1, 1]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.totalShown()).toBe(1);
    expect(labelEngine.totalHidden()).toBe(9);

  });

  it("should return the all shown (getShown) and hidden (getHidden) correctly", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {
      
      boundingBox = {
        bottomLeft : [1, 1],
        topRight   : [1, 1]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.getShown().length).toBe(1);
    expect(labelEngine.getHidden().length).toBe(9);

  });

  it("should return the correct number of collisions", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {

      boundingBox = {
        bottomLeft : [i + 1.0, i + 1.0 ],
        topRight   : [i + 2.0, i + 2.0]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }
    
    expect(labelEngine.getCollisions(0).length).toBe(1);

  });

  it("should reset labelgun and its internal data (tree and label holding object)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {
      
      boundingBox = {
        bottomLeft : [i, i],
        topRight   : [i + 1.0, i + 1.0]
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

    expect(labelEngine.tree.all().length).toBe(10);
    expect(Object.keys(labelEngine.allLabels).length).toBe(10);
    labelEngine.reset();
    expect(Object.keys(labelEngine.allLabels).length).toBe(0);
    expect(labelEngine.tree.all().length).toBe(0);
  
  });

  it("should show highest weighted label and hide others", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 10; i++) {
      
      boundingBox = {
        bottomLeft : [0, 0],
        topRight   : [1.0, 1.0]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        i, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.tree.all().length).toBe(10);
    expect(Object.keys(labelEngine.allLabels).length).toBe(10);
    for (var j = 0; j < 10; j++) {
      if (j === 9) expect(labelEngine.allLabels[9].state).toBe("show");
      else expect(labelEngine.allLabels[j].state).toBe("hide");
    }

  });

  it("overlapping labels should be hidden", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 

    for (var i=0; i < 2; i++) {
      
      boundingBox = {
        bottomLeft : [i, i],
        topRight   : [i + 1.0, i + 1.0]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        i, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    var shown = labelEngine.totalShown();
    var hidden = labelEngine.totalHidden();
    expect(shown).toBe(1);
    expect(hidden).toBe(1);
    expect(labelEngine.allLabels[0].state).toBe("hide");
    expect(labelEngine.allLabels[1].state).toBe("show");
    expect(labelEngine.getCollisions(0).length).toBe(1);

  
  });

  it("none overlapping labels should all be shown (1000 labels)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 1000;

    for (var i=0; i < n; i++) {
        
      boundingBox = {
        bottomLeft : [i, 1 + i],
        topRight   : [0.5 + i, 0.5 + i]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.tree.all().length).toBe(n);
    expect(Object.keys(labelEngine.allLabels).length).toBe(n);
    expect(labelEngine.getShown().length).toBe(1000);

  });

  it("overlapping labels should all be hidden except the one with the highest weight (1000 labels)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
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
        parseInt(Math.random() * (100 - 1) + 1), // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.tree.all().length).toBe(n);
    expect(Object.keys(labelEngine.allLabels).length).toBe(n);
    var shownLabels = labelEngine.getShown();
    expect(shownLabels.length).toBe(1);
    expect(shownLabels[0].state).toBe("show");
    labelEngine.getHidden().forEach(function(label) {
      expect(label.state).toBe("hide");
    });

  });


  it("intermittently overlapping labels should be shown and hidden correctly (1000 labels)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 1000;

    for (var i=0; i < n; i++) {
        
      boundingBox = {
        bottomLeft : [i, i],
        topRight   : [1 + i, 1 + i]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.update();

    expect(labelEngine.tree.all().length).toBe(n);
    expect(Object.keys(labelEngine.allLabels).length).toBe(n);
    expect(labelEngine.getShown().length).toBe(500);
    expect(labelEngine.getHidden().length).toBe(500);

  });

  it("randomly overlapping labels should always have the correct state (1000 labels)", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 2000;

    for (var i=0; i < n; i++) {
      
      var randPos = Math.random() * 10;

      boundingBox = {
        bottomLeft : [randPos, randPos],
        topRight   : [1 + randPos, 1 + randPos]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test " + i,
        false
      );

    }

    labelEngine.update();
    var shown = labelEngine.getShown();
    shown.forEach(function(label){
      expect(label.state).toBe("show");
    });
    shown.forEach(function(label){
      expect(typeof(label)).toBe("object");
      expect(typeof(label.id)).toBe("number");

      labelEngine.getCollisions(label.id).forEach(function(collidedLabel) {
        expect(typeof(collidedLabel)).toBe("object");
        expect(collidedLabel.state).toBe("hide");
      });
    });

    labelEngine.getHidden().forEach(function(label){
      expect(label.state).toBe("hide");
    });

  });

  it("dragged labels should always be shown over un-dragged", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 1000;

      
    boundingBox = {
      bottomLeft : [0, 0],
      topRight   : [1.0, 1.0]
    };

    labelEngine.ingestLabel(
      boundingBox,
      500, //id
      0, // Weight
      {}, // label object
      "Test",
      true
    );

    for (var i = 0; i < n; i++) {

      if (i !== 500) {

        boundingBox = {
          bottomLeft : [0, 0],
          topRight   : [1.0, 1.0]
        };

        labelEngine.ingestLabel(
          boundingBox,
          i, //id
          i, // Weight
          {}, // label object
          "Test",
          false
        );
      }
    
    }

    labelEngine.update();

    expect(labelEngine.tree.all().length).toBe(n);
    expect(Object.keys(labelEngine.allLabels).length).toBe(n);
    expect(labelEngine.getShown().length).toBe(1);
  
    for (var key in labelEngine.allLabels) {
      var label = labelEngine.allLabels[key];
      if (label.id === 500) {
        expect(label.state).toBe("show");
      } else {
        expect(label.state).toBe("hide");
      }
    }

  });


  it("should allow for setting one label as changed", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 10;

    for (var i = 0; i < n; i++) {

      boundingBox = {
        bottomLeft : [0, 0],
        topRight   : [1, 1]
      };

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );
      
    }

    labelEngine.allLabels[5].weight = 1000;
    labelEngine.labelHasChanged(5);
    expect(labelEngine.hasChanged.length).toBe(1);

    labelEngine.update(true);

    expect(labelEngine.getShown().length).toBe(1);
    expect(typeof(labelEngine.getShown()[0])).toBe("object");
    expect(labelEngine.getShown()[0].id).toBe(5);

  });


  it("should allow for setting multiple labels as changed", function(){
   
    var hideLabel = function(){ return false; };
    var showLabel = function(){ return true; };
    var labelEngine = new labelgun.default(hideLabel, showLabel);
    var boundingBox; 
    var n = 20;

    for (var i = 0; i < n; i++) {

      if (i > 10) {
        boundingBox = {
          bottomLeft : [10, 10],
          topRight   : [11, 11]
        };
      } else {
        boundingBox = {
          bottomLeft : [0, 0],
          topRight   : [1, 1]
        };
      }

      labelEngine.ingestLabel(
        boundingBox,
        i, //id
        1, // Weight
        {}, // label object
        "Test",
        false
      );

    }

    labelEngine.allLabels[5].weight = 1000;
    labelEngine.allLabels[14].weight = 500;
    labelEngine.labelHasChanged(5);
    labelEngine.labelHasChanged(14);
    expect(labelEngine.hasChanged.length).toBe(2);

    labelEngine.update(true);

    expect(labelEngine.getShown().length).toBe(2);
    expect(typeof(labelEngine.getShown()[0])).toBe("object");
    expect(typeof(labelEngine.getShown()[1])).toBe("object");

  });


});