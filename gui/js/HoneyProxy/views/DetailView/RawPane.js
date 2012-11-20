define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/RawPane.html"
], function(declare, _WidgetBase, _TemplatedMixin, template) {
 
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        title: "Raw",
        onHide: function(){
        	console.log("onHide called.")
        },
        _onShow: function(){
        	this.loadContent();
        },
        loadContent: function(){
        	/*
        	 * TODO: Return promise for both getContent requests.
        	 * This can be returned by _onShow for proper displaying.
        	 */
        	var model = this.get("model");
        	if(model && this.get("loadedModel") != model) {
	    		var rawPane = this;
	    		/*
	    		 * TODO: Currently there is still a race issue present here if
	    		 * a second flow gets loaded shortly after loadContent got called.
	    		 * Eliminate it when converting sharedFlowProperties.getContent()
	    		 * to dojo xhr and implementing promises.
	    		 */
	    		model.request.getContent(function(content){
	    			rawPane.set("requestContent",content != "" ? content : "<empty request content>");
	    		});
	    		model.response.getContent(function(content){
	    			rawPane.set("responseContent",content != "" ? content : "<empty response content>");
	    		});
	    		this.set("loadedModel",model);
	    		return true;
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
        _setFilenameAttr: { node: "filenameNode", type: "innerText"},
        requestHeader: undefined,
        _setRequestHeaderAttr: { node: "requestHeaderNode", type: "innerText"},
        requestContent: undefined,
        _setRequestContentAttr: { node: "requestContentNode", type: "innerText"},
        responseHeader: undefined,
        _setResponseHeaderAttr: { node: "responseHeaderNode", type: "innerText"},
        responseContent: undefined,
        _setResponseContentAttr: { node: "responseContentNode", type: "innerText"}
    });
 
});