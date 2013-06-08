/**
 * Flow View Interface. All views should implement this.
 */
define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../FlowBindings","../MessageUtils","../RequestUtils","../ResponseUtils"], 
         function(declare, _ReactiveTemplatedWidget, flowBindings, FlowUtils, RequestUtils, ResponseUtils) {
           
  var AbstractView = declare([_ReactiveTemplatedWidget], {
    bindings: flowBindings,
    context: {
      MessageUtils: MessageUtils,
      RequestUtils: RequestUtils,
      ResponseUtils: ResponseUtils
    }
  });
  
  AbstractView.className = undefined;// a list of classes following the pattern flow-flowType
  AbstractView.template = undefined; // Template file to fill
  AbstractView.matches = function (flow) {
    //function that returns whether true if the view should be used to display the flow, false otherwise.
  };
  
  return AbstractView;
});