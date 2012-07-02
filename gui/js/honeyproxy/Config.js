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
	HoneyProxy.config = new Config(
			JSON.parse(decodeURIComponent(location.hash).replace("#","")));
})();