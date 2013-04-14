define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var CssView = BasicContentView.createSubclass([]);
  
  CssView.className = "flow-css " + BasicContentView.className;
  CssView.matches = function(data) {
    if (data.contentType) {
      return !!data.contentType.match(/css/i);
    } else if (data.path) {
      return !!data.path.match(/\.css$/i);
    }
    return false;
  };

  return CssView;
});