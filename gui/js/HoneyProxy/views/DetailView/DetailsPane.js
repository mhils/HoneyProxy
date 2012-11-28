define([
    "dojo/_base/declare",
    "./_DetailViewPane",
    "dojo/dom-construct",
    "dojo/text!./templates/DetailsPane.ejs"
], function(declare, _DetailViewPane, domConstruct, template) {
 
    return declare([_DetailViewPane], {
        templateString: template,
        title: "Details",
        loadContent: function(){
        	var model = this.get("model");
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
    });
 
});