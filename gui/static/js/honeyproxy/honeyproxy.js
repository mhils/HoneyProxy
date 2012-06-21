var HoneyProxy = {
		flowModels:[]
};
	
_.extend(HoneyProxy, Backbone.Events);

$(function(){
	
	HoneyProxy.traffic = new HoneyProxy.Traffic;
	
	HoneyProxy.websocket.initialize();
	
	HoneyProxy.on("authenticated",function(){
		console.time("fetch");
		HoneyProxy.traffic.fetch();
	});
	
	HoneyProxy.trafficView = new HoneyProxy.TrafficView({collection: HoneyProxy.traffic, el: $("#traffic")[0]});	

	
	//debug
	window.HoneyProxy = HoneyProxy;

	//traffic.on("all",function(f){console.warn(arguments)});

});