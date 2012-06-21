var HoneyProxy = {
		flowModels:[]
};
	
_.extend(HoneyProxy, Backbone.Events);



//debug
window.HoneyProxy = HoneyProxy;

$(function(){
	
	$("#splitter").height($(window).height());
	
	$("#splitter").splitter({outline: true,sizeLeft: $(window).width()-100, minLeft: 500});
	
	HoneyProxy.traffic = new HoneyProxy.Traffic;
	HoneyProxy.on("authenticated",function(){
		console.time("fetch");
		HoneyProxy.traffic.fetch();
	});
	HoneyProxy.websocket.initialize();
	HoneyProxy.trafficView = new HoneyProxy.TrafficView({collection: HoneyProxy.traffic, el: $("#traffic")[0]});	
	
});