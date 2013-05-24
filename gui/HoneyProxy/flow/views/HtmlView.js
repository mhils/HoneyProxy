define(["./BasicContentView"], 
         function(BasicContentView) {
           
  var HtmlView = BasicContentView.createSubclass([]);
  
  HtmlView.className = "flow-html " + BasicContentView.className;
  HtmlView.matches = HtmlView.simpleMatcher(/html/i, /\.(x?html|php|aspx?)$/i);

  return HtmlView;
});