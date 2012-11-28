define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dojo/Deferred",
    "dojo/dom-construct",
    "lodash",
    "../../util/_DynamicTemplatedMixin",
    "dojo/text!./templates/DetailsPane.ejs"
], function(declare, _WidgetBase, Deferred, domConstruct, _, _DynamicTemplatedMixin, template) {
 
    return declare([_WidgetBase, _DynamicTemplatedMixin], {
        templateString: template,
        templateCompileFunction: _.template,
        templateRenderFunction: function(compiled){
        	return this.get("model") ? compiled(this) : "<div></div>";
        },
        title: "Details",
        _onShow: function(){
        	onShowThis = this;
        	args = arguments;
        },
        _setModelAttr: function(/*Flow*/ model){
        	if(model && this.get("model") != model) {
	        	this._set("model",model);
	        	
	        	this.refresh();
	        	
	        	if(model.request.hasContent) {
	        		var requestContentNode = this.requestContentNode;
	        		if(model.request.hasFormData){
	        			var headerRow = domConstruct.place("<tr><td class=title>Form Data:</td></tr>",requestContentNode,"only");
	        			var loading = domConstruct.create("td",{innerHTML: "Loading..."},headerRow,"last");
	        			model.request.getFormData().then(function(formData){
	        				fragment = document.createDocumentFragment();
	        				for(var i=0;i<formData.length;i++) {
	        					//FIXME: Replace underscore.js escaping.
	        					fragment.appendChild(domConstruct.toDom(
	        						"<tr><td>"+_.escape(decodeURIComponent(formData[i].name))+"</td><td>"+_.escape(decodeURIComponent(formData[i].value))+"</td></tr>"
	        						));
	        				}
	        				domConstruct.empty(loading);
	        				domConstruct.place(fragment,requestContentNode,"last");
	        			});
	
	        		} else  {
	        			domConstruct.place("<tr><td class=title colspan=2>Request Payload:</td></tr>",requestContentNode,"only")
	        		}
	        	} else {
	        		domConstruct.empty(this.requestContentNode);
	        	}
        	}
        },
    });
 
});