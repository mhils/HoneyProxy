
	
	var HoneyProxy = {};
	
	_.extend(HoneyProxy, Backbone.Events);
		
	/**
	 * A model factory that returns a new instance of the model that .matches() the given arguments
	 */
	function modelFactory(models,fallback) {
		
		/**
		 * Create an instance of Cls with the given arguments
		 */
		function newCall(Cls,args){
			//based on http://stackoverflow.com/a/8843181/934719
			return new (Function.bind.apply(Cls, 
					[0].concat(Array.prototype.slice.call(args))) //[0].concat(arguments.asArray())
					);
		}
		
		return function factory() {
			var data = {
					contentType : getContentTypeFromHeaders(arguments[0].response.headers)
			}
			
			var model = _.find(models,function(m){
				if("matches" in m) {
					var x = m.matches(data);
					return x;
				}
				return false;
			});
			model = model || fallback;

			return newCall(model,arguments);
		}
		
	}
	
	function getContentTypeFromHeaders(headers){
		var contentType = _.find(headers, function(header){
			return !!header[0].match(/Content-Type/i);
		});
		return contentType ? contentType[1].split(";")[0] : undefined;
	}
	
	var Flow = Backbone.Model.extend({
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
		getContentSize: function(){
			if(!this.has("contentSize"))
			{
				var prefix = ["B","KB","MB","GB"];
				var size = this.get("response").content.length;
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
					var contentType = getContentTypeFromHeaders(this.get("response").headers);
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
		matches: function(){
			return false;
		}
	});
	
	var ImageFlow = Flow.extend({
		getCategory: function(){
			return "image";
		}
		
	}, {matches: function(data){
		if(data.contentType)
			return !!data.contentType.match(/image/i);
		return false;
	}});
	
	var DocumentFlow = Flow.extend({
		getCategory: function(){
			return "document";
		}
		
	}, {matches: function(data){
		if(data.contentType)
			return !!data.contentType.match(/text/i);
		return false;
	}});
	
	var CSSFlow = DocumentFlow.extend({
		getCategory: function(){
			return "css";
		}
	}, {matches: function(data){
		if(data.contentType)
			return !!data.contentType.match(/css/i);
		return false;
	}});
	
	var flowFactory = modelFactory([ImageFlow,CSSFlow,DocumentFlow],Flow);
	
	
	var Traffic = Backbone.Collection.extend({
		  model: flowFactory
	});
	
	var traffic = new Traffic;
	
$(function(){
	
	function sendWS(msg){
		ws.send(JSON.stringify(msg));
	}
	var urlData = JSON.parse(decodeURIComponent(location.hash).replace("#",""));
	var ws = new WebSocket(urlData.ws);
	ws.onopen = function(e){
		sendWS({action:"auth",key:urlData.auth});
		log("Connection etablished");
	};
	
	ws.onmessage = function(o) {
		console.timeEnd("ws-send");
		var e = JSON.parse(o.data);
		switch(e.msg){
		case "Authenticated.":
			HoneyProxy.trigger("authenticated");
			break;
		case "read":
			console.timeEnd("fetch")
			if(e.id in Backbone._syncrequests)
			{
				var req = Backbone._syncrequests[e.id];
				clearTimeout(req.onError);
				req.success(e.data);
			}
			break;
		case "newflow":
			traffic.add(e.data);
			break;
		}
		
		log(e);
	};
		
	Backbone._syncrequests = {}
	
	Backbone.sync = function(method, model, options) {
		if(method != "read")
		{
			console.warn("only read is supported");
			return;
		}
			
		
		id = model.id ? model.id : "all";
		var msg = {action:"read", id: id};
		Backbone._syncrequests[id] = {onError: window.setTimeout(function(){options.error("WebSocket Timeout.");},5000),
									  success: options.success};
		console.time("ws-send");
		ws.send(JSON.stringify(msg));
		
	}
	HoneyProxy.on("authenticated",function(){
		console.time("fetch");
		traffic.fetch();
	});
	
	var FlowView = Backbone.View.extend({
		template: _.template($("#template-flow").html()),
		tagName: "tr",
		render: function() {
			var html = this.template(this.model);
			this.$el.html(html);
			this.$el.addClass("category-"+this.model.getCategory())
			this.$el.addClass("request-scheme-"+this.model.getRequestScheme())
			return this;
		}
	});
	
	var TrafficView = Backbone.Marionette.CollectionView.extend({
		  itemView: FlowView,
		  el: $("#traffic")
	});
	
	var trafficView = new TrafficView({collection: traffic});	

	
	//debug
	window.traffic = traffic;

	//traffic.on("all",function(f){console.warn(arguments)});
	
	function log(msg){
		//console.timeEnd(1);
		console.log(msg);
		//console.log(msg);
		//document.getElementById("log").innerText += msg+"\n";
		/*try {
		//data = JSON.parse(msg);
		var tbl = prettyPrint( msg );
		document.getElementById("log").insertBefore( tbl, document.getElementById("log").firstChild );
		//document.getElementById("log").innerText += data.msg+"\n";
		//document.getElementById("log").innerHTML += '<img src="data:image/png;base64,'+window.btoa(data.response.content)+'">"'
		} catch(e) {}*/
	};
});



//ws.send("ping");