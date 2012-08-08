//Proxy object for better access to Flows. Be aware that both Request and Response objects are stateless!
Request = function(flow){
	this._flow = flow;
};
Request.prototype = {
	get _attr() {
		return "request";
	},
	get path() {
		return this.data.path;
	},
	get host() {
		return this.data.host;
	},
	get port() {
		return this.data.port;
	},
	get method() {
		return this.data.method; 
	},
	get scheme() {
		return this.data.scheme;
	},
	get hasFormData() {
		if(!this.hasContent)
			return false;
		var requestContentType = this.getHeader(/Content-Type/i);
		return !!requestContentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i);
	},
	get hasPayload() {
		return this.hasContent && (!this.hasFormData);
	},
	getFormData: function(callback){
		if(this._flow.has("formDataParsed"))
			callback(this._flow.get("formDataParsed"));
		else
			this.getContent((function(data){
				var formData = HoneyProxy.parseParameters(data)
				this._flow.set("formDataParsed",formData);
				callback(formData);
			}).bind(this));
		return this;
	},
	_processName: function(){
		var params = this.path.split("?");
		var path = params.shift().split("/");
		var filename = path.pop();
		this._flow.set("filename", filename==="" ? "/" : filename );
		this._flow.set("fullpath", this.scheme + "://" + this.host + ":" + this.port + path.join("/") + "/" );		
	},
	get filename() {
		if(!this._flow.has("filename"))
			this._processName();
		return this._flow.get("filename");
	},
	get fullPath() {
		if(!this._flow.has("fullpath"))
			this._processName();
		return this._flow.get("fullpath");
	}
};
//FIXME: This works only with our patched version of underscore
//https://github.com/documentcloud/underscore/pull/694
_.extend(Request.prototype,HoneyProxy.sharedFlowProperties);