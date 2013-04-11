if(define && define.amd) //for the builder
	define.amd.jQuery = true;
require(
["dojo/when",
 "dojo/on",
 "dojo/topic", 
 "HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/flow/FlowFactory",
 "HoneyProxy/flow/views/all",
 "HoneyProxy/traffic",
 "HoneyProxy/util/versionCheck",
 "HoneyProxy/util/sampleFlow",
 "HoneyProxy/util/requestAuthenticator",
 "HoneyProxy/tutorial",
 "HoneyProxy/search",
 "HoneyProxy/popOut"
 ], function(when,on,topic,MainLayout,websocket,FlowFactory, allViews, flowStore, versionCheck, sampleFlow) {
	
	//Debug
	window.HoneyProxy = {
		flowStore:flowStore,
		sampleFlow: sampleFlow
	};
	
	when(websocket.authenticated,function(){
		flowStore.fetch();
	});
	
	var flowFactory = new FlowFactory({views: allViews});
	topic.subscribe("HoneyProxy/newFlow",function(flowData){
	  var flow = flowFactory.createFlow(flowData);
	  flowStore.add(flow);
	});
	
	window.flowFactory = flowFactory;
	window.setTimeout(versionCheck,3000);
});