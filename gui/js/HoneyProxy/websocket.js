define(["./config","dojo/json","./traffic"],function(config,JSON,traffic){
	
	/**
	 * HoneyProxy Websocket Client.
	 * Connect to the WS URL, perform authentication and listen for new flows or responses to sync requests.
	 */
	var websocket = {
		send: function(jsonMsg){
			this.ws.send(JSON.stringify(jsonMsg));
		},
		onmessage: function onmessage(o) {
			var e = JSON.parse(o.data);
			switch(e.msg) {
				case "Authenticated.":
					websocket.trigger("authenticated");
					break;
				case "read":
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
			
			console.log(e);
		}
	};
	_.extend(websocket, Backbone.Events);
	
	this.ws = new WebSocket(config.get("ws"));
	this.ws.onopen = function(e){
		websocket.send({action:"auth",key:config.get("auth")});
		console.log("Connection etablished");
	};
	this.ws.onmessage = this.onmessage;
	
	/**
	 * Backbone.sync implementation using WebSockets.
	 * Supplies an id for each request and waits for a response with this id.
	 * TODO: Use the JSON API instead.
	 * WebSocket should be used for communicating newly arrived flows,
	 * but it's clearly not made for a 1:1 request/response model.
	 */
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
		websocket.send(msg);
		
	};
	
	return websocket;
});
