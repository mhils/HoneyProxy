/**
 * ES5: This function watches an object property for changes.
 * 
 * Known issues: 
 * When mixing with other functions that overwrite property descriptors (Object.defineProperty),
 * Garbage collection might fail for the property descriptors. 
 * This should be a rare edge case we cannot work around.
 * 
 * Example:
 * 
 * var x = {a:42};
 * var warnHandle = watch(x,"a",console.warn.bind(console));
 * x.a += 1;
 * Warn:  a 42 43
 * 
 * var errorHandle = watch(x,"a",console.error.bind(console));
 * x.a--;
 * Warn:  a 43 42
 * Error: a 43 42
 * 
 * warnHandle.unwatch();
 * x.a = 123;
 * Error: a 42 123
 * 
 */
define([],function(){
	"use strict";
	
	return function watch(obj, prop, handler) {
		while(obj !== null && !obj.hasOwnProperty(prop))
			obj = Object.getPrototypeOf(obj);
		if(!obj || !(prop in obj))
			throw "property "+prop+" not defined";
		
		var desc = Object.getOwnPropertyDescriptor(obj, prop);
		var newGet, newSet;
		
		//Throw an error if the property is read-only
		if (!desc.configurable || (!("value" in desc) && !desc.set) || desc.writable === false)
			throw "cannot watch readonly descriptor";
		
		if ("value" in desc) { //Handle data descriptors
			newGet = function() {
				return desc.value;
			};
			newSet = function(newVal) {
				if(!newSet.unwatch) {
					handler.call(this, prop, desc.value, newVal);
				} //else console.debug("data descriptors is done");
				desc.value = newVal;
			};
		} else { //Handle accessor descriptors
			var current = obj[prop];
			newGet = desc.get;
			newSet = function(newVal) {
				desc.set.call(this, newVal);
				if(!newSet.unwatch) {
					handler.call(this, prop, current, obj[prop]);
					current = obj[prop];
				} //else console.debug("accessor descriptors is done");
			};
		}
		Object.defineProperty(obj, prop, {
			get: newGet,
			set: newSet,
			configurable: true,
			enumerable: desc.enumerable
		});
		
		var unwatch = function() {
			
			var currentdesc = Object.getOwnPropertyDescriptor(obj, prop);
			if(currentdesc.set === newSet) {
				//console.debug("Property descriptor is on top of the stack, destroying...");
				Object.defineProperty(obj, prop, desc);
				if(desc.set && desc.set.unwatch)
					desc.set.unwatch();
			} else {
				//console.debug("Mark property descriptor as destroyable.");
				newSet.unwatch = unwatch;
			}
			
		};
		
		return { "unwatch": unwatch };
	};
});