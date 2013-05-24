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
  BasicContentView.matches = BasicContentView.simpleMatcher(/application|text/i);

  return BasicContentView;
});