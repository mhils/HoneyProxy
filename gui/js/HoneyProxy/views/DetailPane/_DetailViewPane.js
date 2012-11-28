define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "../../util/_DynamicTemplatedMixin",
    "lodash"
], function(declare, _WidgetBase, _DynamicTemplatedMixin, _) {
 
    return declare([_WidgetBase, _DynamicTemplatedMixin], {
        templateCompileFunction: _.template,
        templateRenderFunction: function(compiled){
        	return this.get("model") ? compiled(this) : "<div></div>";
        },
        //TODO: Maybe subscribe to attr change of "selected"
        //rather than using undocumented underscore functions.
        //Let's see how this is handled in dojo 2.0
        _onShow: function(){
        	if(this.get("model") !== this.get("loadedModel"))
        		return this._loadContent();
        	return true;
        },
        _loadContent: function(){
        	this.set("loadedModel",this.get("model"));
        	this.refresh();
        	return this.loadContent();
        },
        _setModelAttr: function(/*Flow*/ model){
        	if(model) {
        		this._set("model",model);
        		if(this.get("selected")) {
            		this._onShow();
            	}
        	}
        	
        }
    });
 
});