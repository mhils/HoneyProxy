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
		
		if (!obj) {
			return {
				unwatch: function() {}
			};
		}
		
		console.debug("recursiveWatch(", obj, keys, callback, ")");
		
		if(keys.length === 0  || !(keys[0] in obj)){
	      return watchProperty(obj, undefined, callback);
		}

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
	/*
	recursiveWatch.computed = function(func){
          deps  = Array.prototype.slice.call(arguments,1),
          value,
          watchers;
      var proxy = function(){
        if(!value)
          value = func.call(this);
        return value;
      };
      proxy.watch = function(prop, callback){
        if(!callback) {
          callback = prop;
          prop = undefined;
        }
          
        if(!watchers) {
          watchers = {};
          var handler = function(){
            var oldVal = value;
            value = func.call(this);
            for(var w in watchers){
              w(undefined, oldVal, value);
            }
          };
          deps.forEach(function(dep){
            recursiveWatch(self,dep,handler);
          });
        }
        watchers[callback] = true;
        return { unwatch: function(){
          delete watchers[callback];
        }};
      };
      return proxy;
    };
    */
	return recursiveWatch;
});