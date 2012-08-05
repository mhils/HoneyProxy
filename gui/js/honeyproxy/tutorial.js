$(function(){
	
	HoneyProxy.on("firstflow",function(){
			$("#tutorial").hide();
	});
	
	HoneyProxy.on("configLoaded",function(){
		var addr = HoneyProxy.config.get("proxy-addr");
		if(addr==="")
			addr = "HoneyProxy listens on all your network interfaces, choose one (most times localhost)";
		$("#tutorial-proxy-addr").text(addr);
		$("#tutorial-proxy-port").text(HoneyProxy.config.get("proxy-port"));		
	});
		
	

});