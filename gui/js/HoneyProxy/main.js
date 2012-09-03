require({
	packages:[{
        name:"HoneyProxy",
        location:"../../HoneyProxy",
        tlmSiblingOfDojo: false
    }]
},	
["HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/traffic",
 "HoneyProxy/tutorial",
 "HoneyProxy/search",
 "HoneyProxy/dirdump",
 "HoneyProxy/TableSorter",
 "HoneyProxy/popOut"], function(MainLayout,websocket,traffic) {
	websocket.on("authenticated",function(){
		traffic.fetch();
	});
});