/**
 * Flow View Interface. All views should implement this.
 */
define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../FlowBindings"], 
         function(declare, _ReactiveTemplatedWidget, flowBindings) {
           
  var AbstractView = declare([_ReactiveTemplatedWidget], {
    bindings: flowBindings
  });
  
  AbstractView.className = undefined;// a list of classes following the pattern flow-flowType
  AbstractView.template = undefined; // Template file to fill
  AbstractView.matches = function (flow) {
    //function that returns whether true if the view should be used to display the flow, false otherwise.
  };
  
  //Simple matching function generator
  AbstractView.simpleMatcher = function(contentType, filename){
    return function(flow) {
      if (contentType && flow.response.contentType && !!flow.response.contentType.match(contentType))
        return true;
      else if (filename && flow.request.filename && !!flow.request.filename.match(filename))
        return true;
      return false;
    };
  };

  return AbstractView;
});