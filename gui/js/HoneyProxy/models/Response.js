/**
 * Proxy object for better access to Flows. 
 * Be aware that both Request and Response objects are stateless!
 */
define(["../utilities","./sharedFlowProperties"],function(utilities,sharedFlowProperties){
	
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
	_.extend(Response.prototype,sharedFlowProperties);
	return Response;
});
