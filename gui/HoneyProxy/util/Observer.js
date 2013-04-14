/**
 * "Polyfill" for Harmony Object.observe
 * The module is designed to be replaced by Object.observe as soon as the harmony spec is finalized.
 * 
 */
define(["dojo/_base/declare"],function(declare){
  "use strict";
  
  var Observer = {};
  
  Observer.polyfillMixin = declare([],{
    refresh: function(){
      var self = this;
      for(var watched_prop in this._watchCallbacks) {
        var callbacks = this._watchCallbacks[watched_prop];
        callbacks.forEach(function(callback){
          var prop_name = watched_prop.replace(/^_/,"");
          callback(prop_name , undefined, self[prop_name]);
        });
      }
    }
  });
  
  var unobservable = {
    remove: function(){}
  };
  
  Observer.observeProperty = function(obj, prop, callback) {
    if(obj.watch) {
      var handle = obj.watch(prop,function(name, oldValue, newValue){
        callback.call(this, {
          type: "updated",
          object: obj,
          name: name,
          oldValue: oldValue
        });
      });
      return { remove: function(){
        handle.remove();
      }};
    }
    return unobservable;
  };
  return Observer;
});