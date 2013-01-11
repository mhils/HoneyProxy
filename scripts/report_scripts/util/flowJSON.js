/**
 * This utility class stringifies a passed JSON that contains flows.
 * Whenever an object has a "flow" property, its key gets formatted as a link.
 * All other data gets escaped properly.
 */
define(["lodash"],function(_){
  
  var makelink = function(k,flow,classNameSafe){
    return "<span class='"+classNameSafe+"' data-flow-id="+parseInt(flow.id)+">"+_.escape(k)+"</span>";
  };
  
  var replacer = function(classNameSafe, key, value){
    if (value && typeof value === 'object') {
      var keys = [];
      for(var k in value)
        keys.push(k);
      for (var i=0; i<keys.length; i++) {
        var k = keys[i];
        
        var safe_k;
        if(value[k] !== null && value[k].flow) {
          safe_k = makelink(k,value[k].flow,classNameSafe);
          delete value[k].flow;
        } else {
          safe_k = _.escape(k);
        }
        if(safe_k !== k) {
          value[safe_k] = value[k];
          delete value[k];
        }
        
      }
    } else {
      value = _.escape(value);
    }
    return value;
  };
  return { 
    "stringify" : function(tree,className){
      return JSON.stringify(tree, replacer.bind(undefined, _.escape(className || "openDetail")), "\t");
    }
  };
  
});