/**
 * Proxy object for better access to Flows. 
 * Be aware that both Request and Response objects are stateless!
 */
define(["dojo/_base/declare","../utilities","./sharedFlowProperties","../util/safeMixin-es5"],function(declare, utilities, sharedFlowProperties){
  
  var Response = function(flow){
    this._flow = flow;
  };
  Response.prototype = {
    get _attr() {
      return "response";
    },
    get code() {
      return this.data.code;
    },
    get cert() {
      return this.data.cert;
    },
    get rawFirstLine() {
      return ["HTTP/" + this.httpversion.join("."),this.code,this.msg]
          .join(" ")+"\n";
    }
  };
  declare.safeMixin(Response.prototype,sharedFlowProperties);
  return Response;
});
