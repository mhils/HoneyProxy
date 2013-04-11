/**
 * Flow subclass responsible for proper display of general files. Basically
 * loading file content into a pre tag. Most other flow classes inherit from
 * this.
 */
define([ "dojo/_base/declare", "dojo/dom-construct", "dojo/on", "../../util/_ReactiveTemplatedWidget", "dojo/text!./templates/BasicContentView.ejs" ], 
  function(declare, domConstruct, on, _ReactiveTemplatedWidget, template) {
	
	var BasicContentView = declare([_ReactiveTemplatedWidget], {
		bindings: {
		  displayContent: function(node, keys, newValue, oldValue, handle){
		    
		    if(handle && handle.loading)
		      handle.loading.cancel("outdated");
		    
		    node.classList.remove("preview-empty");
		    node.classList.remove("preview-active");
		    node.classList.remove("preview-loading");
		    
		    function load(){
		      handle.loading = newValue.getContent().then(function(content){
		        delete handle.loading;
		        node.textContent = content;
		        node.classList.remove("preview-loading");
		        node.classList.add("preview-active");
		      });
		    }
		    
		    if(newValue.hasContent){
		      node.classList.add("preview-loading");
		      if(newValue.hasLargeContent) {
		        var button = domConstruct.place("<button>Load Content ("+newValue.contentLengthFormatted+")</button>",node,"only");
		        on(button,"click",load);
    		  } else{
    		    load();
    		  }
		    } else {
		      node.classList.add("preview-empty");
		    }
		    
		  }
		  }
	});
	BasicContentView.template = template;
	BasicContentView.matches = function(data) {
		if (data.contentType)
			return !!data.contentType.match(/application|text/i);
		return false;
	};
	
	return BasicContentView;
});