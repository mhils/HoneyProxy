define(["./BinaryView"], 
         function(BinaryView) {
           
  var FlashView = BinaryView.createSubclass([]);
  
  FlashView.className = "flow-flash " + BinaryView.className;
  FlashView.resourceName = "Adobe Flash file"
  FlashView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/flash/i)) {
      return true;
    } else if (flow.request.filename) {
      return !!flow.request.filename.match(/\.swf$/i);
    }
    return false;
  };

  return FlashView;
});