/**
 * Flow View Interface. All views should implement this.
 */
define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../FlowBindings"], 
         function(declare, _ReactiveTemplatedWidget, flowBindings) {
           
  var IView = declare([_ReactiveTemplatedWidget], {
    bindings: flowBindings
  });
  
  IView.className = undefined;// a list of classes following the pattern flow-flowType
  IView.template = undefined; // Template file to fill
  IView.matches = function (flow) {
    //function that returns whether true if the view should be used to display the flow, false otherwise.
  };

  return IView;
});