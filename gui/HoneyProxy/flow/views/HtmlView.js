define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var HtmlView = BasicContentView.createSubclass([]);
  
  HtmlView.className = "flow-html " + BasicContentView.className;
  HtmlView.matches = function(data) {
    if (data.contentType && !!data.contentType.match(/html/i))
      return true;
    else if (data.path)
      return !!data.path.match(/html$/i);
    return false;
  };

  return HtmlView;
});