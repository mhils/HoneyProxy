/**
 * Reactive templating for Dojo
 */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/query",
    "dijit/_WidgetBase",
    "lodash",
    "./recursive-watch",
    "./Observer"
],function(declare, domConstruct, query, _WidgetBase, _, recursiveWatch, Observer){
  
    var default_bindings = {
      "replaceNode": function(node, keys, newValue, oldValue, handle){
        console.debug(this,arguments);
        if(!newValue)
          newValue = domConstruct.create("div");
        var self = this;

        node.parentNode.replaceChild(newValue, node);
        node = newValue;
        
        handle.unwatch();
        handle = recursiveWatch(self, keys, function(changed_subtree_name, oldValue, newValue){
          self.update_binding("replaceNode", node, keys, newValue, oldValue, handle );
        }); 
      }
  };
  
  var eventListenerBinding = function(type, node, keys, newValue, oldValue, handle){
    var self = this;
    var func = this;
    
    
    while(keys.length) {
      //We're dealing with the DOM here -> only bind to the highest level.
      func = func[keys.shift()];
    }
    
    node.addEventListener(type,function(){
      func.apply(self,Array.prototype.slice.call(arguments)); //TODO: Maybe call with different args?
    });
    handle.remove();
    
  };
  
  ["click","load"].forEach(function(event){
    default_bindings[event] = eventListenerBinding;
  });
  
  var _ReactiveTemplatedWidget = declare([_WidgetBase,Observer.polyfillMixin], {
    _bindings: default_bindings,
    get_binding: function(type){
      if(this.bindings && (type in this.bindings)){
        return this.bindings[type];
      } else if(type in this._bindings){
        return this._bindings[type];
      }
    },
    get_keys: function(type, keystr){
      var keys = keystr.trim().split(".");
      var binding = this.get_binding(type);
      if(binding && binding.key){
        keys = binding.key(keys);
      }
      return keys;
    },
    update_binding: function(type, node, keys, newValue, oldValue, handle){
        // console.debug("update_binding", arguments);
        var binding = this.get_binding(type);
        if(binding){
          binding.apply(this,Array.prototype.slice.call(arguments));
        } else {
          node[type] = newValue;
        }
    },
    buildRendering: function(){
      var self = this;
      
      var tmplObj = Object.getPrototypeOf(this).constructor;
      
      while(tmplObj && !tmplObj.template) {
        tmplObj = tmplObj.superclass.constructor;
      }
      if(!tmplObj)
        throw "No template specified.";
      
      if(!tmplObj._template) {
        //console.debug("Compiling template...",tmplObj);
        tmplObj._template = _.template(tmplObj.template.trim());
      }
        
            
      var html = tmplObj._template(this);
          
      this.domNode = domConstruct.toDom(html);
            
      //If we have multiple nodes, toDom returns a  #document-fragment.
      //Wrap it in a <div>, if necessary.
      if(this.domNode.nodeType === 11){
        var _domNode = domConstruct.create("div");
        _domNode.appendChild(this.domNode);
        this.domNode = _domNode;
      }
            
        var nodes_to_bind = query("[data-bind]",this.domNode);
        if(this.domNode.dataset.bind) //root node is not included by default
          nodes_to_bind.push(this.domNode);
        
          
        nodes_to_bind.forEach(function(node){
          // console.debug("Binding...",node);
          var node_bindings = node.dataset.bind.split(",");
          node_bindings.forEach(function(binding){
            binding = binding.split(":");
            var type = binding[0].trim(),
                keys = self.get_keys( type, binding.slice(1).join(":") ); 
            
            var operateOnView = keys[0] === "view";
            keys  = operateOnView ? keys.slice(1) : keys;
            var model = operateOnView ? self : self.model;
            
            var value = model, 
                k = keys.slice();
            while(k.length >= 1)
              value = value[k.shift()];
            
            var handle = recursiveWatch(model, keys, function(change){
              self.update_binding(type, node, keys, change.object[change.name], change.oldValue, handle );
            });
            
            self.update_binding(type, node, keys, value, undefined, handle);
          });
        });      
    }
  });
  return _ReactiveTemplatedWidget;
});