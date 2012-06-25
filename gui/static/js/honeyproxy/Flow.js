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
	getContent: function(){
		return this.get("response").content;
	},
	getRawContentSize: function(){
		return this.get("response").content.length
	},
	getContentSize: function(){
		if(!this.has("contentSize"))
		{
			var prefix = ["B","KB","MB","GB"];
			var size = this.getRawContentSize();;
			while(size > 1024 && prefix.length > 1){
				prefix.shift();
				size = size / 1024;
			}
			this.set("contentSize",Math.floor(size)+prefix.shift());
		}
		return this.get("contentSize");
		
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