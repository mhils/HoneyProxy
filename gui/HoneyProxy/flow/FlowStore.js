/**
 * Implements dojo/store/api/Store
 */
define(["dojo/_base/declare","dojo/store/Memory"], function(declare, Memory){
  
  var FlowStore = declare([Memory],{
    fetch: function(){
      console.error("FIXME unimplemented",arguments);
    },
    on: function(){ 
      console.error("FIXME unimplemented",arguments);
    }
  });
  return FlowStore;
});