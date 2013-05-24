define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var CssView = BasicContentView.createSubclass([]);
  
  CssView.className = "flow-css " + BasicContentView.className;
  CssView.matches = CssView.simpleMatcher(/css/i, /\.css$/i);
  
  return CssView;
});