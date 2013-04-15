define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var CssView = BasicContentView.createSubclass([]);
  
  CssView.className = "flow-css " + BasicContentView.className;
  CssView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/css/i)) {
      return true;
    } else if (flow.request.filename) {
      return !!flow.request.filename.match(/\.css$/i);
    }
    return false;
  };

  return CssView;
});