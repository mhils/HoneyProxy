HoneyProxy.Flow = Backbone.Model.extend({
	_processName: function(){
		var params = this.get("request").path.split("?");
		var path = params.shift().split("/")
		var filename = path.pop();
		this.set("filename", filename==="" ? "/" : filename );
		this.set("fullpath", this.get("request").scheme + "://" + this.get("request").host + ":" + this.get("request").port + path.join("/") + "/" );
	},
	getFilename: function(){
		if(!this.has("filename"))
			this._processName();
		return this.get("filename");
	},
	getFullPath: function(){
		if(!this.has("fullpath"))
			this._processName();
		return this.get("fullpath");
	},
	getRequestMethod: function(){
		return this.get("request").method;
	},
	getStatusCode: function(){
		return this.get("response").code;
	},
	getContentURL: function(direction,action){
		var url = HoneyProxy.config.get("content")
		+"/"+this.get("id")
		+"/"+direction+"/"+action
		+"?"+$.param(
				{"auth":HoneyProxy.config.get("auth")});
		return url;
	},
	getRequestContentURL: function(action){
		return this.getContentURL("request",action);
	},
	getRequestContentDownloadURL: function(action){
		return this.getRequestContentURL("attachment");
	},
	getRequestContentViewURL: function(action){
		return this.getRequestContentURL("inline");
	},
	getResponseContentURL: function(action){
		return this.getContentURL("response",action);
	},
	getResponseContentDownloadURL: function(){
		return this.getResponseContentURL("attachment");
	},
	getResponseContentViewURL: function(){
		return this.getResponseContentURL("inline");
	},
	getRequestContent: function(callback){
		if(this.hasRequestContent())
			$.get(this.getRequestContentViewURL(),callback);
		else
			callback("");
		return this;
	},
	getResponseContent: function(callback){
		if(this.hasResponseContent())
			$.get(this.getResponseContentViewURL(),callback);
		else
			callback("");
		return this;
	},
	getRequestContentLength: function(){
		return this.get("request").contentLength
	},
	getResponseContentLength: function(){
		return this.get("response").contentLength
	},
	getContentLengthFormatted: function(direction){
		var attr = direction+"ContentLength";
		if(!this.has(attr))
		{
			var prefix = ["B","KB","MB","GB"];
			var size = this.get(direction).contentLength
			while(size > 1024 && prefix.length > 1){
				prefix.shift();
				size = size / 1024;
			}
			this.set(attr,Math.floor(size)+prefix.shift());
		}
		return this.get(attr);
	},
	getResponseContentLengthFormatted: function(){
		return this.getContentLengthFormatted("response");
	},
	getRequestContentLengthFormatted: function(){
		return this.getContentLengthFormatted("request");
	},
	hasResponseContent: function(){
		return this.getResponseContentLength() > 0;
	},
	hasRequestContent: function(){
		return this.getRequestContentLength() > 0;
	},
	getContentType: function(){
		if(!this.has("contentType"))
			if(this.has("response"))
			{
				var contentType = HoneyProxy.getContentTypeFromHeaders(this.get("response").headers);
				if(contentType)	
					this.set("contentType", contentType);
			}
		return this.get("contentType");
	},
	getCategory: function(){
		return "none";
	},
	getRequestScheme: function(){
		return this.get("request").scheme;
	},
	getDate: function(){
		if(!this.has("timestampFormatted")) {
			this.set("timestampFormatted",
					new Date(this.get("request").timestamp * 1000));
		}
		return this.get("timestampFormatted");
	},
	getHeader: function(direction, regex){
		var header = _.find(this.get(direction).headers, function(header){
			return !!header[0].match(regex);
		});
		return header ? header[1] : undefined;
	},
	getRequestHeader: function(regex){
		return this.getHeader("request",regex);
	},
	hasFormData: function(invert){
		invert = invert || false;
		if(!this.hasRequestContent())
			return false;
		var requestContentType = this.getRequestHeader(/Content-Type/i);
		return invert ^ !!requestContentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i)
	},
	getFormData: function(callback){
		if(this.has("formDataParsed"))
			callback(this.get("formDataParsed"));
		else
			this.getRequestContent((function(data){
				var formData = HoneyProxy.parseParameters(data)
				this.set("formDataParsed",formData);
				callback(formData);
			}).bind(this));
		return this;
	},
	hasRequestPayload: function(){
		return this.hasFormData(true);
	},
	getRequestHeaders: function(){
		return this.get("request").headers;
	},
	getResponseHeaders: function(){
		return this.get("response").headers;
	},
	matches: function(){
		return false;
	},
	getPreview: function(){
		return HoneyProxy.DocumentFlow.prototype.getPreview.apply(this);
		//return "no preview mode available.";
		/* TODO */
	}
});