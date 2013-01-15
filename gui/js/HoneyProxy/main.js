if(define && define.amd) //for the builder
	define.amd.jQuery = true;
require(
["dojo/when",
 "dojo/on",
 "dojo/topic", 
 "jquery",
 "HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/traffic",
 "HoneyProxy/util/versionCheck",
 "HoneyProxy/util/sampleFlow",
 "HoneyProxy/util/requestAuthenticator",
 "HoneyProxy/tutorial",
 "HoneyProxy/search",
 "HoneyProxy/popOut"
 ], function(when,on,topic,jquery,MainLayout,websocket,traffic,versionCheck, sampleFlow) {
	
	//Debug
	window.HoneyProxy = {
		traffic:traffic,
		sampleFlow: sampleFlow
	};
	
	when(websocket.authenticated,function(){
		traffic.fetch();
	});
	
	topic.subscribe("HoneyProxy/newFlow",function(flowData){
		traffic.add(flowData);
	});
	
	window.setTimeout(versionCheck,1000);
});