/**
 * Proxy object for better access to Flows. Be aware that both Request and
 * Response objects are stateless!
 */

define(["./FlowPropertyDecorator", "./sharedFlowProperties"], function(FlowPropertyDecorator, sharedFlowProperties) {
  "use strict";

  var responseDecorator = new FlowPropertyDecorator("response");

  responseDecorator.addProperties(sharedFlowProperties);

  responseDecorator.addProperties({
    rawFirstLine: {
      func: function(){
        return ["HTTP/" + this.httpversion.join("."),this.code,this.msg]
          .join(" ")+"\n";
      },
      deps: ["httpversion","code","msg"]
    }
  });
  
  return responseDecorator;

});
