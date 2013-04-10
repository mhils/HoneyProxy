/**
 * ES5: This function watches for changes of an objects property.
 * 
 * 1) the callback only fires if the property object "pointer" got changed,
 *    e.g. foo.bar = {}; watch(foo,"bar",...); foo.bar.baz = 42; doesn't trigger.
 * 2) if the object has a watch function, we subscribe to it for change events.
 *    This allows you to circumvent the limitations of #1.
 *   
 * Known issues:
 * -  When mixing with other functions that overwrite property descriptors (Object.defineProperty),
 *    garbage collection might fail for the property descriptors. 
 *    This should be a rare edge case we cannot work around.
 * 
 * Example:
 * 
 * var x = {};
 * var warnHandle = watch(x,"a",console.warn.bind(console));
 * x.a = 3;
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
  
  var unwatchable = { "unwatch": function(){} }
  
  function watchPrimitive(obj, prop, handler){
    if(!prop) {
      return unwatchable;
    }
    
    var desc, newGet, newSet;
    if(prop in obj){
      while(obj && !obj.hasOwnProperty(prop)) {
        obj = Object.getPrototypeOf(obj);
      }
      desc = Object.getOwnPropertyDescriptor(obj, prop);
    } else {
      desc = { 
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined
       };
    }
    
    //Throw an error if the property is read-only
    if (!desc.configurable || (!("value" in desc) && !desc.set) || desc.writable === false)
    throw "cannot watch readonly descriptor";
    
    if ("value" in desc) { //Handle data descriptors
      newGet = function() {
        return desc.value;
      };
      newSet = function(newVal) {
        var oldVal = desc.value;
        desc.value = newVal;
        if(!newSet.unwatch) {
          handler.call(this, prop, oldVal, newVal);
        } //else console.debug("data descriptors is done");
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
  }
  
  function watchStateful(obj, prop, handler) {
    return obj.watch(prop,handler);
  }
  
  
  return function watch(obj, prop, handler) {
    if(!obj) {
      throw "object is undefined";
    }
    if(obj.watch)
      return watchStateful(obj, prop, handler);
    else
      return watchPrimitive(obj, prop, handler);
  };
});