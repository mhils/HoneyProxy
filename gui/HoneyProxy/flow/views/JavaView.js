define(["./BinaryView"], 
         function(BinaryView) {
           
  var JavaView = BinaryView.createSubclass([]);
  
  JavaView.className = "flow-java " + BinaryView.className;
  JavaView.resourceName = "Java Archive"
  JavaView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/application\/java-archive/i))
      return true;
    else if (flow.request.filename)
      return !!flow.request.filename.match(/\.(jar|class)$/i);
    return false;
  };

  return JavaView;
});