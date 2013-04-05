/*
 *  Recursively watch a nested javascript object for changes, e.g.
 *  recursiveWatch(stateFul, ["foo","bar"], callback)
 *  notifies on changes of both stateFul.foo and stateFul.foo.bar
 *  http://devopsreactions.tumblr.com/post/42420931277/debugging-recursive-code
 */
define([ "./watch-property" ], function(watchProperty) {
	"use strict";
	
	function get(obj, prop) {
		//use formal getters for conformance
		return ("get" in obj) ? obj.get(prop) : obj[prop];
	}
	
	function recursiveWatch(obj, keys, callback) {
		
		if (keys.length === 0 || !obj || !(keys[0] in obj)) {
			return {
				unwatch: function() {}
			};
		}
		
		console.debug("recursiveWatch(", obj, keys, callback, ")");
		
		var subhandle = recursiveWatch(get(obj, keys[0]), keys.slice(1), callback);
		var handle = watchProperty(obj, keys[0], function(name, oldValue, value) {
			console.debug("recursiveWatch handle(", obj, keys, callback, ")");
			//Reroute subhandle to the new stuff
			subhandle.unwatch();
			subhandle = recursiveWatch(value, keys.slice(1), callback);
			
			var k = keys.slice(1);
			while (oldValue && k.length > 0)
				oldValue = get(oldValue, k.shift());
			
			k = keys.slice(1);
			while (value && k.length > 0)
				value = get(value, k.shift());
			callback(keys.join("."), oldValue, value);
		});
		
		return {
			unwatch: function() {
				subhandle.unwatch();
				handle.unwatch();
			}
		};
	}
	return recursiveWatch;
});