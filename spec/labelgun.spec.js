
var labelgun = require("../lib/labelgun");

describe('labelgun', function() {

  it('should import correctly', function(){
    
      var labelEngine = new labelgun.default(function(){}, function(){});

      expect(labelgun).not.toBeUndefined(); 
      expect(labelgun).not.toBeNull(); 

  });

  it('should accept hide and show functions in constructor', function(){

      var hideLabel = function(){ return false; }
      var showLabel = function(){ return true; }
      var labelEngine = new labelgun.default(hideLabel, showLabel);

      expect(labelEngine.hideLabel()).toBe(false);
      expect(labelEngine.showLabel()).toBe(true); 

  });

  it('should ingest labels without failure', function(){

    expect(true).toBe(false);
    
  });


});