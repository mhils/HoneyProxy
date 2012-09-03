require({
	packages:[{
        name:"HoneyProxy",
        location:"../../HoneyProxy"
    }]
},	
["HoneyProxy/MainLayout",
 "HoneyProxy/websocket",
 "HoneyProxy/traffic",
 "HoneyProxy/tutorial",
 "HoneyProxy/search"], function(MainLayout,websocket,traffic) {
	//HoneyProxy.MainLayout = MainLayout;
	websocket.on("authenticated",function(){
		traffic.fetch();
	});
});