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
	getResponseContentURL: function(action){
		var url = HoneyProxy.config.get("content")
			+"/"+this.get("id")
			+"/response/"+action
			+"?"+$.param(
					{"auth":HoneyProxy.config.get("auth")});
		return url;
	},
	getResponseContentDownloadURL: function(){
		return this.getResponseContentURL("attachment");
	},
	getResponseContentViewURL: function(){
		return this.getResponseContentURL("inline");
	},
	getResponseContent: function(callback){
		if(this.hasResponseContent())
			return $.get(this.getResponseContentViewURL(),callback);
		else
			return callback("");
	},
	getResponseContentLength: function(){
		return this.get("response").contentLength
	},
	getResponseContentLengthFormatted: function(){
		if(!this.has("responseContentLength"))
		{
			var prefix = ["B","KB","MB","GB"];
			var size = this.getResponseContentLength();
			while(size > 1024 && prefix.length > 1){
				prefix.shift();
				size = size / 1024;
			}
			this.set("responseContentLength",Math.floor(size)+prefix.shift());
		}
		return this.get("responseContentLength");
		
	},
	hasResponseContent: function(){
		return this.getResponseContentLength() > 0;
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
	hasFormData: function(){
		if(!this.get("request").content)
			return false;
		/* TODO add requestHeader("id") function (see getCT for resp) */
		//requestContentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i)
		return false;
	},
	hasRequestPayload: function(){
		return false /*TODO*/;
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
		return "no preview mode available.";
		/* TODO */
	}
});