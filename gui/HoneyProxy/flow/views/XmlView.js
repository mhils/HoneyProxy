define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var XmlView = BasicContentView.createSubclass([]);
  
  XmlView.className = "flow-xml " + BasicContentView.className;
  XmlView.matches = function(flow) {
    if (flow.response.contentType && !!flow.response.contentType.match(/xml/i))
      return true;
    else if (flow.request.filename)
      return !!flow.request.filename.match(/\.xml$/i);
    return false;
  };

  return XmlView;
});