require({
	packages: [ {
		name: "HoneyProxy",
		location: "../../HoneyProxy",
		tlmSiblingOfDojo: false
	}, {
		name: "ReportScripts",
		location: "/api/fs/report_scripts",
		tlmSiblingOfDojo: false
	} ]
},	
["dojo/when",
 "dojo/on",
 "dojo/topic", 
 "HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/traffic",
 "HoneyProxy/util/versionCheck",
 "HoneyProxy/util/sampleFlow",
 "HoneyProxy/util/requestAuthenticator",
 "HoneyProxy/tutorial",
 "HoneyProxy/search",
 "HoneyProxy/TableSorter",
 "HoneyProxy/popOut"
 ], function(when,on,topic,MainLayout,websocket,traffic,versionCheck, sampleFlow) {
	
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