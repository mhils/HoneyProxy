/**
 * Flow subclass responsible for proper display of general files. Basically
 * loading file content into a pre tag. Most other flow classes inherit from
 * this.
 */
define(["./AbstractView", 
         "dojo/text!./templates/BasicContentView.ejs"], 
         function(AbstractView, template) {
           
  var BasicContentView = AbstractView.createSubclass([]);
  
  BasicContentView.className = "flow-text";
  BasicContentView.template = template;
  BasicContentView.matches = function (flow) {
    if(flow.response.contentType && !!flow.response.contentType.match(/application|text/i)) {
      return true;
    }
    return false;
  };

  return BasicContentView;
});