/**
 * Proxy object for better access to Flows. 
 * Be aware that both Request and Response objects are stateless!
 */
define(["dojo/Deferred","../utilities","./sharedFlowProperties"],function(Deferred,utilities,sharedFlowProperties){
	var Request = function(flow){
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
		get hostFormatted() {
			return "hostFormatted" in this.data ? this.data.hostFormatted : this.host;
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
				return (new Deferred())
					.resolve(this._flow.get("formDataParsed"));
			else {
				var self = this;
				var deferred = new Deferred();
				this.getContent().then(function(data){
					var formData = utilities.parseParameters(data)
					self._flow.set("formDataParsed",formData);
					deferred.resolve(formData);
				});
				return deferred;
			}
		},
		_processName: function(){
			var params = this.path.split("?");
			var path = params.shift().split("/");
			var fullpath = this.scheme + "://" + this.hostFormatted + ":" + this.port + path.join("/");
			var filename = path.pop();
			this._flow.set("filename", filename==="" ? "/" : filename );
			this._flow.set("fullpath", fullpath );		
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
		},
		get rawFirstLine() {
			return [this.method,this.path,"HTTP/" + this.httpversion.join(".")]
	        		.join(" ")+"\n";
		}
	};
	//depends on https://github.com/documentcloud/underscore/pull/694
	_.extend(Request.prototype,sharedFlowProperties);

	return Request;
});