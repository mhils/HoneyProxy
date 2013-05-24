define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var XmlView = BasicContentView.createSubclass([]);
  
  XmlView.className = "flow-xml " + BasicContentView.className;
  XmlView.matches = XmlView.simpleMatcher(/xml/i, /\.xml$/i);

  return XmlView;
});