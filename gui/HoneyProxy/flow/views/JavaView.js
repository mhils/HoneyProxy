define(["./AbstractView",
        "dojo/text!./templates/BasicContentView.ejs"], 
        function(AbstractView, template) {
           
  var JavaView = AbstractView.createSubclass([]);
  
  JavaView.className = "flow-java";
  JavaView.template  = template;
  JavaView.matches   = function(data) {
    if (flow.response.contentType && !!flow.response.contentType.match(/application\/java-archive/i))
      return true;
    else if (flow.request.path)
      return !!flow.request.path.match(/\.(jar|class)$/i);
    return false;
  };

  return JavaView;
});