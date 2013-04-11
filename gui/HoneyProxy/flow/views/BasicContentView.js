/**
 * Flow subclass responsible for proper display of general files. Basically
 * loading file content into a pre tag. Most other flow classes inherit from
 * this.
 */
define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../FlowBindings",
         "dojo/text!./templates/BasicContentView.ejs"], 
         function(declare, _ReactiveTemplatedWidget, flowBindings, template) {
           
  var BasicContentView = declare([_ReactiveTemplatedWidget], {
    bindings: flowBindings
  });
  BasicContentView.template = template;
  BasicContentView.matches = function (data) {
    if(data.contentType)
      return !!data.contentType.match(/application|text/i);
    return false;
  };

  return BasicContentView;
});