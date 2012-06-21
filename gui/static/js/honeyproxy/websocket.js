Backbone._syncrequests = {};

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
	HoneyProxy.websocket.send(msg);
	
};

HoneyProxy.websocket = {
	send: function(jsonMsg){
		this.ws.send(JSON.stringify(jsonMsg));
	},
	initialize: function(){
		var conn = this.getConnectionData();
		this.ws = new WebSocket(conn.ws);
		this.ws.onopen = function(e){
			HoneyProxy.websocket.send({action:"auth",key:conn.auth});
			HoneyProxy.log("Connection etablished");
		};
		this.ws.onmessage = this.onmessage;
	},
	onmessage: function onmessage(o) {
		var e = JSON.parse(o.data);
		switch(e.msg) {
			case "Authenticated.":
				HoneyProxy.trigger("authenticated");
				break;
			case "read":
				console.timeEnd("fetch");
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
		
		HoneyProxy.log(e);
	},
	getConnectionData: function(){
		return JSON.parse(decodeURIComponent(location.hash).replace("#",""));
	}
};