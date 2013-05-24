define(["./BinaryView"], 
         function(BinaryView) {
           
  var FlashView = BinaryView.createSubclass([]);
  
  FlashView.className = "flow-flash " + BinaryView.className;
  FlashView.resourceName = "Adobe Flash file"
  FlashView.matches = FlashView.simpleMatcher(/flash/i, /\.swf$/i);

  return FlashView;
});