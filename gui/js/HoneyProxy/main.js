require({
	packages:[{
        name:"HoneyProxy",
        location:"../../HoneyProxy"
    }]
},	
[ "HoneyProxy/MainLayout"], function(MainLayout) {
	HoneyProxy.MainLayout = MainLayout;
});