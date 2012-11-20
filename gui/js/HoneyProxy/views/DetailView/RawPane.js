define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "../../utilities",
    "dojo/text!./templates/RawPane.html"
], function(declare, all, _WidgetBase, _TemplatedMixin, util, template) {
 
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        title: "Raw",
        onHide: function(){
        	// console.log("onHide called.")
        },
        //TODO: Maybe subscribe to attr change of "selected"
        //rather than using undocumented underscore functions.
        //Let's see how this is handled in dojo 2.0
        _onShow: function(){
        	return this.loadContent();
        },
        loadContent: function(){
        	
        	var model = this.get("model");
        	if(model && this.get("loadedModel") != model) {
        		//Check if there is still a pending request for loading content.
        		//If so, cancel it.
        		var lastReqDef = this.get("lastReqDeferred");
            	if(lastReqDef)
            		lastReqDef.cancel("outdated");
            	var lastRespDef = this.get("lastRespDeferred");
            	if(lastRespDef)
            		lastRespDef.cancel("outdated");
            	
	    		var rawPane = this;

	    		var reqDef = model.request.getContent().then(function(content){
	    			rawPane.set("requestContent",content != "" ? content : "<empty request content>");
	    		});
	    		var respDef = model.response.getContent().then(function(content){
	    			rawPane.set("responseContent",content != "" ? content : "<empty response content>");
	    		});
	    		
	    		this.set("lastReqDeferred",reqDef);
	    		this.set("lastRespDeferred",respDef);
	    		
	    		this.set("loadedModel",model);
	    		
	    		return all([reqDef, respDef]);
        	}
        	return true;
        },
        _setModelAttr: function(/*Flow*/ model){
        	this.set("filename",model.request.filename);
        	this.set("requestHeader",model.request.rawHeader);
        	this.set("responseHeader",model.response.rawHeader);
        	this._set("model",model);
        	if(this.get("selected")) {
        		this.loadContent();
        	}
        },
        filename: undefined,
        _setFilenameAttr: util.textContentPolyfill("filenameNode"),
        requestHeader: undefined,
        _setRequestHeaderAttr: util.textContentPolyfill("requestHeaderNode"),
        requestContent: undefined,
        _setRequestContentAttr: util.textContentPolyfill("requestContentNode"),
        responseHeader: undefined,
        _setResponseHeaderAttr: util.textContentPolyfill("responseHeaderNode"),
        responseContent: undefined,
        _setResponseContentAttr: util.textContentPolyfill("responseContentNode")
    });
 
});