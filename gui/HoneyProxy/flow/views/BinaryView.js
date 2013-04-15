define(["./AbstractView",
        "dojo/text!./templates/BinaryView.ejs"], 
        function(AbstractView, template) {
           
  var BinaryView = AbstractView.createSubclass([]);
  
  BinaryView.className = "flow-binary";
  BinaryView.template  = template;
  BinaryView.matches   = function(flow) {
    return false;
  };

  return BinaryView;
});