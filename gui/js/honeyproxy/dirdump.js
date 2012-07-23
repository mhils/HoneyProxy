(function(){
	HoneyProxy.on("configLoaded",function(){
		if(HoneyProxy.config.get("dumpdir") === true) {
			$("header").prepend('<a target="_blank" href="/dump">Show dumped files</a>')
		}
	});
})();