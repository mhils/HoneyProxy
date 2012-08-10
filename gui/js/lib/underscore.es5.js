(function() {
	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var nativeDefineProperty = Object.defineProperty;
	var slice = Array.prototype.slice;
	var nativePropertyAccessWorksForObjects;
	
	try {
		nativeGetOwnPropertyDescriptor({"a" : true}, "a");
		nativePropertyAccessWorksForObjects = true;
	} catch (e) {
		nativePropertyAccessWorksForObjects = false;
	}

	_.extend = function(obj) {

		var nativeExtend = function(source) {
			for ( var prop in source) {
				nativeDefineProperty(obj, prop, nativeGetOwnPropertyDescriptor(source, prop))
			}
		};
		var simpleExtend = function(source) {
			for ( var prop in source) {
				obj[prop] = source[prop];
			}
		};

		_.each(slice.call(arguments, 1),
			(nativeGetOwnPropertyDescriptor && nativeDefineProperty && nativePropertyAccessWorksForObjects)
			? nativeExtend : simpleExtend);
		return obj;
	};
})();