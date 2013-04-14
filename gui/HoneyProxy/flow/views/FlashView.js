define(["./AbstractView",
        "dojo/text!./templates/BasicContentView.ejs"], 
        function(AbstractView, template) {
           
  var FlashView = AbstractView.createSubclass([]);
  
  FlashView.className = "flow-flash";
  FlashView.template  = template;
  FlashView.matches   = function(data) {
    if (data.contentType) {
      return !!data.contentType.match(/css/i);
    } else if (data.path) {
      return !!data.path.match(/\.css$/i);
    }
    return false;
  };

  return FlashView;
});