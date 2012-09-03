/**
 * Handles the quick start tutorial that is shown if no requests are recorded yet.
 */
define(["./config","./traffic","dojo/domReady!"],function(config,traffic){
	
	traffic.on("firstflow",function(){
		$("#tutorial").hide();
	});
	var addr = config.get("proxy-addr");
	if(addr==="")
		addr = "HoneyProxy listens on all your network interfaces, choose one (most times localhost)";
	$("#tutorial-proxy-addr").text(addr);
	$("#tutorial-proxy-port").text(config.get("proxy-port"));		
	return true;
});