define([])

//HoneyProxy acts as a general event handler (onConfigLoaded, authenticated, newflow, ...)
//_.extend(HoneyProxy, Backbone.Events);

//debug
window.HoneyProxy = HoneyProxy;

(function(){

	//initialize traffic object
	//HoneyProxy.traffic = new HoneyProxy.Traffic;
	//HoneyProxy.on("newflow",HoneyProxy.traffic.add.bind(HoneyProxy.traffic));
	
	//establish websocket communication after config has been loaded.
	//HoneyProxy.on("configLoaded",function(){
	//	HoneyProxy.websocket.initialize();
	//})
	
	//fetch traffic after websocket authentication
	

	$(function(){
		//initialize views
		
		//HoneyProxy.trafficView.on("all",console.log.bind(console));
		//reqjs done HoneyProxy.detailView = new HoneyProxy.DetailView({el: $("#detail")});
	});
})();