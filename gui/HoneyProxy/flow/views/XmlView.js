define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var XmlView = BasicContentView.createSubclass([]);
  
  XmlView.className = "flow-xml " + BasicContentView.className;
  XmlView.matches = function(data) {
    if (data.contentType && !!data.contentType.match(/xml/i))
      return true;
    else if (data.path)
      return !!data.path.match(/\.xml$/i);
    return false;
  };

  return XmlView;
});