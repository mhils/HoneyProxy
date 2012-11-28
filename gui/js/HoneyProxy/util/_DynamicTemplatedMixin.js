/**
 * Use  templating within dojo.
 * not in use
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dijit/_TemplatedMixin"], 
		function(declare,lang,domConstruct,_TemplatedMixin) {
	var _DynamicTemplatedMixin = declare(null,{
		// templateString: [protected] String
		//		A string that represents the widget template.
		//		Use in conjunction with dojo.cache() to load from a file.
		templateString: null,
		/*=====
		// _attachPoints: [private] String[]
		//		List of widget attribute names associated with data-dojo-attach-point=... in the
		//		template, ex: ["containerNode", "labelNode"]
		_attachPoints: [],

		// _attachEvents: [private] Handle[]
		//		List of connections associated with data-dojo-attach-event=... in the
		//		template
		_attachEvents: [],
 		=====*/
		templateCompileFunction: function(tmpl){
			return function(){
				return tmpl;
			}
		},
		templateRenderFunction: function(compiled){
			return compiled(this);
		},
		constructor: function(){
			this._attachPoints = [];
			this._attachEvents = [];
		},
		_stringRepl: function(tmpl){
			return this.templateRenderFunction(tmpl);
		},
		getCachedTemplate: function(templateString) {
			if (!(this.templateCompileFunction in _DynamicTemplatedMixin._templateCache))
				_DynamicTemplatedMixin._templateCache[this.templateCompileFunction] = {};
			var cache = _DynamicTemplatedMixin._templateCache[this.templateCompileFunction];
			if (templateString in cache)
				return cache[templateString];
			var template = this.templateCompileFunction(templateString);
			return (cache[templateString] = template);
		},
		buildRendering: function(){
			this.domNode = domConstruct.create("div");
			
			this.inherited(arguments);
			
			this.refresh();
			
			this._beforeFillContent();		// hook for _WidgetsInTemplateMixin
			this._fillContent(this.srcNodeRef);
		},
		_beforeFillContent: _TemplatedMixin.prototype._beforeFillContent.bind(this),
		_fillContent: _TemplatedMixin.prototype._fillContent.bind(this),
	    refresh: function() {
			this._attachPoints = [];
			this._attachEvents = [];
	    	var template = this.getCachedTemplate(this.templateString);
	    	var content = domConstruct.toDom(this._stringRepl(template));
			domConstruct.place(content,this.domNode,"only");
			_TemplatedMixin.prototype._attachTemplateNodes.call(this,content, function(n,p){ return n.getAttribute(p); });
	    }
	});
	
	//{templateFunc: {templateString: compiledFunction}}
	_DynamicTemplatedMixin._templateCache = {};
	
	return _DynamicTemplatedMixin;
});
