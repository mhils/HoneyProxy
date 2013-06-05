define(["dojo/_base/declare","../util/recursive-watch"],function(declare, recursiveWatch){
  var FlowPropertyDecorator = declare([],{
    constructor: function(attr){
      this.attr = attr;
      this.properties = {}
    },
    addProperties: function(props){
      for(var name in props){
        var prop =  props[name];
        this.addProperty(name, prop);
      }
    },
    addProperty: function(name, prop){
      
      var func = prop.func || function(){
        return prop.value;
      };
      
      var property = { func: func, deps: prop.deps ? prop.deps.slice() : [], deps_required: [] };

      for(var i=0;property.deps && i<property.deps.length;i++) {
        
        if(property.deps[i][0] === "?") {
          property.deps_required.push(false);
          property.deps[i] = property.deps[i].substr(1);
        } else {
          property.deps_required.push(true);
        }
        
        property.deps[i] = property.deps[i].indexOf("flow.") == 0 ? property.deps[i].replace("flow.","") : this.attr+"."+property.deps[i];
      }
      this.properties[name] = property;
      property.deps = property.deps.map(function(dep){ return dep.split(".") });
    },
    decorate: function(flow){
      var self = this;
      var obj = flow[this.attr];
      
      //FIXME: This assignment should be reactive as well.
      Object.defineProperties(obj, {
        _flow: { value: flow },
        _attr: { value: this.attr }
      });
      Object.keys(this.properties).forEach(function(property_name){
        var property = self.properties[property_name];
        var update = function(){
          //check whether any required dependency is undefined.
          //if so, break and set property to undefined.
          for(var i=0; i<property.deps.length; i++){
            if(!property.deps_required[i])
              continue;
            var dep = property.deps[i].slice(),
                val = flow;
            while(dep.length > 0){
              val = val[dep.shift()];
              if(val === undefined){
                return Object.defineProperty(obj,property_name,{
                  value: undefined,
                  configurable: true
                });
              }
            }
          }
          //all dependencies are either defined or allowed to be undefined, call property func and assign return value
          Object.defineProperty(obj,property_name,{
            value: property.func.call(obj),
            //writable: false (default),
            //enumerable: false (default),
            configurable: true
          });
        }
        
        property.deps.forEach(function(dep){
          recursiveWatch(flow,dep,update);
        });
        
        update();
      });
    }
  });
  return FlowPropertyDecorator;
});