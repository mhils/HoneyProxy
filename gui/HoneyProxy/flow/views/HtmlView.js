define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var HtmlView = BasicContentView.createSubclass([]);
  
  HtmlView.className = "flow-html " + BasicContentView.className;
  HtmlView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/html/i))
      return true;
    else if (flow.request.filename)
      return !!flow.request.filename.match(/html$/i);
    return false;
  };

  return HtmlView;
});