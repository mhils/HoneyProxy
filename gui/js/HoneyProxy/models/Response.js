/**
 * Proxy object for better access to Flows. 
 * Be aware that both Request and Response objects are stateless!
 */
Response = function(flow){
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
	get contentType() {
		if(!this._flow.has("contentType"))
		{
			var contentType = HoneyProxy.getContentTypeFromHeaders(this.headers);
			this._flow.set("contentType", contentType);
		}
		return this._flow.get("contentType");
	}
};
//FIXME: This works only with our patched version of underscore
//https://github.com/documentcloud/underscore/pull/694
_.extend(Response.prototype,HoneyProxy.sharedFlowProperties);