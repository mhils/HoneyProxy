/**
 * Reactive templating for Dojo
 */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/query",
    "dijit/_WidgetBase",
    "lodash",
    "./recursive-watch"
],function(declare, domConstruct, query, _WidgetBase, _, recursiveWatch){
	
    var default_bindings = {
      "replaceNode": function(node, keys, newValue, oldValue, handle){
      	console.warn(this,arguments);
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
	
	return declare([_WidgetBase], {
	  _bindings: default_bindings,
	  update_binding: function(type, node, keys, newValue, oldValue, handle){
	  	  console.debug("update_binding", arguments);
    	  if(type in this._bindings){
    	  	this._bindings[type].apply(this,Array.prototype.slice.call(arguments,1));
    	  } else if(this.bindings && type in this.bindings){
    	  	this.bindings[type].apply(this,Array.prototype.slice.call(arguments,1));
    	  } else {
    	    node[type] = newValue;
    	  }
	  },
		buildRendering: function(){
			var self = this;
			
			if(!this.constructor._template) {
			  console.debug("Compiling template...",this);
			  this.constructor._template = _.template(this.constructor.template.trim());
			}
				
						
			var html = this.constructor._template(this);
		    	
			this.domNode = domConstruct.toDom(html);
						
			//If we have multiple nodes, toDom returns a  #document-fragment.
			//Wrap it in a <div>, if necessary.
			if(this.domNode.nodeType == 11){
				var _domNode = domConstruct.create("div");
				_domNode.appendChild(this.domNode);
				this.domNode = _domNode;
			}
						
		  	var nodes_to_bind = query("[data-bind]",this.domNode);
		  	if(this.domNode.dataset.bind) //root node is not included by default
		  	  nodes_to_bind.push(this.domNode);
		  	
		  	  
		  	nodes_to_bind.forEach(function(node){
		  	  console.debug("Binding...",node);
		  	  var node_bindings = node.dataset.bind.split(",");
		  	  node_bindings.forEach(function(binding){
		  	    binding = binding.split(":");
		  	    var type = binding[0].trim(),
		  	        keys  = binding.slice(1).join(":").trim().split(".");
		  	    
		  	    var value=self, k = keys.slice();
		  	    while(k.length >= 1)
		  	      value = value.get ? value.get(k.shift()) : value[k.shift()];
		  	    
		  	    
		  	    var handle = recursiveWatch(self, keys, function(changed_subtree_name, oldValue, newValue){
		  	      self.update_binding(type, node, keys, newValue, oldValue, handle );
		  	    });
		  	    
		  	    self.update_binding(type, node, keys, value, undefined, handle);
		  	  });
		  	})			
		}
	});
});
