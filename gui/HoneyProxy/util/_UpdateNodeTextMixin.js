define([], function() {
	
	var _mixin = function(){};
	_mixin.prototype.updateNodeText = function(nodeId,text){
		this[nodeId+"Node"].textContent = text;
	};
	return _mixin;
});