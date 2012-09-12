require({
	packages:[{
        name:"HoneyProxy",
        location:"../../HoneyProxy",
        tlmSiblingOfDojo: false
    }]
},	
["dojo/when",
 "dojo/on",
 "dojo/topic", 
 "HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/traffic",
 "HoneyProxy/tutorial",
 "HoneyProxy/search",
 "HoneyProxy/dirdump",
 "HoneyProxy/TableSorter",
 "HoneyProxy/popOut"], function(when,on,topic,MainLayout,websocket,traffic) {
	
	//Debug
	window.HoneyProxy = {traffic:traffic};
	
	when(websocket.authenticated,function(){
		traffic.fetch();
	});
	
	topic.subscribe("HoneyProxy/newFlow",function(flowData){
		traffic.add(flowData);
	});
});