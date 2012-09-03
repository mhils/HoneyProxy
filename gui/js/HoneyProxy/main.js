require({
	packages:[{
        name:"HoneyProxy",
        location:"../../HoneyProxy"
    }]
},	
["./MainLayout","./websocket","./traffic"], function(MainLayout,websocket,traffic) {
	//HoneyProxy.MainLayout = MainLayout;
	websocket.on("authenticated",function(){
		traffic.fetch();
	});
});