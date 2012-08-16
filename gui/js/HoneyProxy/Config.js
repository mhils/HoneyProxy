/**
 * basic config for our gui.
 * TODO: A backbone model would be appropriate here.
 */
(function(){
		
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
	
	console.log("start request");
	$.getJSON("/api/config", function(data){
		HoneyProxy.config = new Config(data);
		HoneyProxy.config.set("content","/files");
		HoneyProxy.trigger("configLoaded");
	});
})();