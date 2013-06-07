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
    update_binding: function(type, node, newValue, oldValue, handle){
        // console.debug("update_binding", arguments);
        var binding = this.get_binding(type);
        if(binding){
          binding.apply(this,Array.prototype.slice.call(arguments));
        } else {
          node[type] = newValue;
        }
    },
    /**
     *  Compiles the Widget Template and converts it into a DOM Node.
     *  Returns the DOM Node.
     */
    _buildDom: function(){
      //Firstly, we search the (dojo-declare) prototype chain for a prototype holding a template.
      //We use the underscore templating micro engine (~ http://ejohn.org/blog/javascript-micro-templating/)

      var tmplObj = Object.getPrototypeOf(this).constructor;
      
      while(tmplObj && !tmplObj.template) {
        tmplObj = tmplObj.superclass.constructor;
      }
      if(!tmplObj)
        throw "No template specified.";
      
      //If the template hasn't been compiled yet, do so.
      if(!tmplObj._template) {
        console.debug("Compiling template...",tmplObj);
        tmplObj._template = _.template(tmplObj.template.trim());
      }
     
      var html = tmplObj._template(this);
      
      //convert template string into DOM
      var domNode = domConstruct.toDom(html);
            
      //If we have multiple nodes, toDom returns a  #document-fragment.
      //Wrap it in a <div>, if necessary.
      if(domNode.nodeType === 11){
        var _domNode = domConstruct.create("div");
        _domNode.appendChild(domNode);
        domNode = _domNode;
      }
    },
    _getValue: function(keys){
      var value;
      if(keys[0] in self.with){
        value = self.with;
      } else {
        value = self.model;
      }
      var k = property_obj_keys.slice();
      while(value && k.length > 0)
          value = value[k.shift()];
      return value;
    }
    _addBinding: function(binding){
      var self = this;
      var splitPosType  = binding.indexOf(":");
      var type          = binding.substr(0,splitPosType).trim(),
      var property_expr = binding.substr(splitPosType+1).trim();

      property_expr = decodeURIComponent(property_expr); //decode encoded ";"s

      var splitPosFunc = property_expr.indexOf("(");
      var is_function = splitPosFunc >= 0;

      var property_obj_keys = is_function ? property_expr.substr(0,splitPosFunc) : property_expr;
      property_obj_keys = property_obj_keys.split(".");

      var value, parent;
      if(property_obj_keys[0] in self.with){
        value = self.with;
      } else {
        value = self.model;
      }

      var keys = property_obj_keys.slice();
      while(keys.length >= 1) {
        parent = value;
        value = value[keys.shift()];
      }
          

      var dependencies = is_function ? [] : [property_obj_keys];
      if(is_function && "dependencies" in value){
        dependencies = value.dependencies(); //FIXME: We need dependencies on the model.
      }

      if(is_function){ //currently only a single parameter is accepted.
        var param = property_expr.substring(splitPosFunc+1,property_expr.length-1);
        param = self._getValue(param.split("."));
        value = value.call(parent,param);
      }

      var observeHandles = [];
      dependencies.forEach(function(dependency){
        var handle = recursiveWatch(model, dependency, function(change){
          self.update_binding(type, node, change.object[change.name], change.oldValue, handle );
        });
        observeHandles.push(handle);
      });
        
      self.update_binding(type, node, value, undefined, handle);
      return observeHandles;
    },
    buildRendering: function(){
      var self = this;

      var this.domNode = this._buildDom();

      var nodes_to_bind = query("[data-bind]",this.domNode);
      if(this.domNode.dataset.bind) //query doesn't include the root node, check manually.
        nodes_to_bind.push(this.domNode);
      
      nodes_to_bind.forEach(function(node){
        // console.debug("Binding...",node);
        var node_bindings = node.dataset.bind.split(";");
        node_bindings.forEach(self._addBinding.bind(self));
      });      
    }
  });
  return _ReactiveTemplatedWidget;
});