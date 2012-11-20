define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/Deferred",
    "dojo/dom-construct",
    "../../utilities",
    "dojo/text!./templates/PreviewPane.html"
], function(declare, _WidgetBase, _TemplatedMixin, Deferred, domConstruct, util, template) {
 
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        title: "Preview",
        //TODO: Maybe subscribe to attr change of "selected"
        //rather than using undocumented underscore functions.
        //Let's see how this is handled in dojo 2.0
        _onShow: function(){
        	return this.loadContent();
        },
        loadContent: function(){

        	var model = this.get("model");

        	if(model && this.get("loadedModel") != model) {
        		//Check if there is still a pending request for generating a preview.
        		//If so, cancel it.
        		var lastRequest = this.get("previewRequest");
            	if(lastRequest)
            		lastRequest.cancel("outdated");
            	
	    		var previewPane = this;
	    		
	    		var previewFunc = model.response.hasContent ? 
	    				model.getPreview.bind(model) : 
	    				model.getPreviewEmpty.bind(model);
	    		
	    		var deferred = new Deferred();
	    		
	    		var previewRequest = previewFunc().then(function(previewHTML){
	    			previewPane.set("previewHTML",previewHTML);
	    			deferred.resolve(true);
	    			window.previewPane = previewPane;//FIXME:Debug
	    		});
	    		this.set("previewRequest",previewRequest);
	    		this.set("loadedModel",model);
	    		return deferred;
        	}
        	return true;
        },
        _setModelAttr: function(/*Flow*/ model){
        	this.set("filename",model.request.filename);
        	this.set("responseDownloadUrl",model.response.downloadUrl);

        	this._set("model",model);
        	if(this.get("selected")) {
        		this.loadContent();
        	}
        },
        
        filename: undefined,
        _setFilenameAttr: util.textContentPolyfill("filenameNode"),
        responseDownloadUrlAttr: undefined,
        _setResponseDownloadUrlHeaderAttr: { node: "downloadButtonNode", type: "attribute", attribute: "href"},
        previewHTML: undefined,
        _setPreviewHTMLAttr: function(previewHTML){
        	domConstruct.place(previewHTML,this.previewHTMLNode,"only");
        	this._set("previewHTML",previewHTML);
        }
    });
 
});