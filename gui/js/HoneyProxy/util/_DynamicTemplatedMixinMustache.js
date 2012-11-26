/**
 * Use mustache templating within dojo.
 * not in use
 */
define(["dojo/_base/declare","dojo/_base/lang","dojo/dom-construct","mustache","dijit/_TemplatedMixin"], 
		function(declare,lang,domConstruct,Mustache,_TemplatedMixin) {
	return declare(_TemplatedMixin,{
		_skipNodeCache:true,
	    _stringRepl: function(template){
	        // override the default/basic ${foo} substitution in _Templated
	        return Mustache.render(template, this); // String
	    },
	    refresh: function(){
	    	
	    	var cached = _TemplatedMixin.getCachedTemplate(this.templateString, this._skipNodeCache, this.ownerDocument);
	    	
	    	var node = domConstruct.toDom(this._stringRepl(cached), this.ownerDocument);
			if(node.nodeType != 1){
				// Flag common problems such as templates with multiple top level nodes (nodeType == 11)
				throw new Error("Invalid template: " + cached);
			}
			this.domNode = node;
	    	domConstruct.place(node,this.domNode,"replace");
	    }
	});
	return _TemplatedMixin;
});
