(function(){
	
	//TODO: A backbone model would be appropriate here.
	
	Config = function(data){
		this.storage = {}; //localStorage might leak sensitive information
		$.extend(this.storage, data);
	};
	Config.prototype.get = function(id){
		return this.storage[id];
	};
	Config.prototype.set = function(id,val){
		this.storage[id] = val;
	}
	
	$.getJSON("/api/config", function(data){
		HoneyProxy.config = new Config(data);
		HoneyProxy.config.set("content","/files");
		HoneyProxy.trigger("configLoaded");
	});
})();