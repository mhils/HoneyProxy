/*
 *  Recursively watch a nested javascript object for changes, e.g.
 *  recursiveWatch(stateFul, ["foo","bar"], callback)
 *  notifies on changes of both stateFul.foo and stateFul.foo.bar
 *  http://devopsreactions.tumblr.com/post/42420931277/debugging-recursive-code
 */
define([ "./Observer" ], function(Observer) {
	"use strict";
	
	function recursiveWatch(obj, keys, callback) {
		
		if (!obj) {
			return {
				remove: function() {}
			};
		}
		
		console.debug("recursiveWatch(", obj, keys, callback, ")");
		
		if(keys.length === 0  || !(keys[0] in obj)){
	      return Observer.observeProperty(obj, undefined, callback);
		}

		var subhandle = recursiveWatch(obj[keys[0]], keys.slice(1), callback);
		var handle = Observer.observeProperty(obj, keys[0], function(name, oldValue, value) {
			console.debug("recursiveWatch handle(", obj, keys, callback, ")");
			//Reroute subhandle to the new stuff
			subhandle.remove();
			subhandle = recursiveWatch(value, keys.slice(1), callback);
			
			var k = keys.slice(1);
			while (oldValue && k.length > 0)
				oldValue = oldValue[k.shift()];
			
			k = keys.slice(1);
			while (value && k.length > 0)
				value = value[k.shift()];
			callback(keys.join("."), oldValue, value);
		});
		
		return {
			remove: function() {
				subhandle.remove();
				handle.remove();
			}
		};
	}
	return recursiveWatch;
});