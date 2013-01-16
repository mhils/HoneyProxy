/**
 * Handles the quick start tutorial that is shown 
 * if no requests are recorded yet.
 * TODO: Move into the traffic table when moving over to dgrid if possible.
 * It's hacky currently, but that's okay. There will never be any deps.
 */
define(["./config","./MainLayout","./traffic","dojo/when"],function(config,MainLayout,traffic,when){
	
	require(["dojo/domReady!"],function(){
		var alwaysHidden = false;
		
		when(traffic.firstFlow,function(){
			alwaysHidden = true;
			$("#tutorial").hide();
		});
		MainLayout.mainContainer.watch("selectedChildWidget",function(name,oval,nval){
			if(alwaysHidden)
				return;
			$("#tutorial").toggle(nval == MainLayout.trafficPane);
		});
		
		var addr = config.get("proxy-addr");
		if(addr==="")
			addr = "HoneyProxy listens on all your network interfaces, choose one (most times localhost)";
		$("#tutorial-proxy-addr").text(addr);
		$("#tutorial-proxy-port").text(config.get("proxy-port"));		
	});
	
	return true;
});