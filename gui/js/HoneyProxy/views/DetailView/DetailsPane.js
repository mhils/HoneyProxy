define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/Deferred",
    "dojo/dom-construct",
    "../../util/_UpdateNodeTextMixin",
    "dojo/text!./templates/DetailsPane.html"
], function(declare, _WidgetBase, _TemplatedMixin, Deferred, domConstruct, _UpdateNodeTextMixin, template) {
 
    return declare([_WidgetBase, _TemplatedMixin, _UpdateNodeTextMixin], {
        templateString: template,
        title: "Details",
        _onShow: function(){
        },
        formatHeaders: function(title,headers){
        	var ret = "<tr><td class=title colspan=2>"+title+"</td></tr>";
    		for(var i=0;i<headers.length;i++){
				ret +=
				"<tr class=request-headers>" +
					"<td class=header-name>" + headers[i][0] + "</td>" +
					"<td class=header-value>" + headers[i][1] + "</td>" +
				"</tr>";
			}
    		return ret;
        },
        formatChecksums: function(title,checksums){
        	var ret = "<tr><td class=title colspan=2>"+title+"</td></tr>";
    		for(var item in checksums) {
    			ret += '<tr><td>'+item+'</td><td><ul>';
    			for(var algo in checksums[item]) {
    				ret += '<li>'+algo + ": "+checksums[item][algo]+'</li>';
    			}
    			ret += '</ul></td></tr>';
			}
    		return ret;
        },
        updateDetailsNode: function(title,r,node){
        	if(r.hasContent){
	        	var downloadbutton = domConstruct.toDom('<tr><td></td><td><a class="button-download button-request-payload" href="'+r.downloadUrl+'">Download ('+r.contentLengthFormatted+')</a></td></tr>')
	    		var checksums = this.formatChecksums(title,r.contentChecksums);
	    		domConstruct.place(downloadbutton,node,"only");
	    		domConstruct.place(checksums,node,"last");
        	} else {
        		domConstruct.empty(node);
        	}
        },
        _setModelAttr: function(/*Flow*/ model){
        	this.searchSimilar.dataset["search"] = "similarTo:"+model.id+",3";
        	this.updateNodeText("filename",model.request.filename);
        	this.updateNodeText("fullPath",model.request.fullPath);
        	this.updateNodeText("requestMethod",model.request.method);
        	this.updateNodeText("statusCode",model.response.code);
        	
        	//Request Headers
        	var requestHeaders = this.formatHeaders("Request Headers:",model.request.headers);
        	domConstruct.place(requestHeaders,this.requestHeaderNode,"only");
        	
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
        		this.updateDetailsNode("Request Checksums",model.request,this.requestContentDetailsNode)
        	} else {
        		domConstruct.empty(this.requestContentNode);
        	}
        	
        	//Response Headers
        	var responseHeaders = this.formatHeaders("Response Headers:",model.response.headers);
        	domConstruct.place(responseHeaders,this.responseHeaderNode,"only");
        	
        	//Response Content Details
        	this.updateDetailsNode("Response Checksums",model.response,this.responseContentDetailsNode);
        	
        	if(model.response.cert) {
        		domConstruct.place('<tr><td colspan=2 class=title>Server certificate:</td></tr><tr><td colspan=2><pre class="raw raw-cert">'+ _.escape(model.response.cert)+'</pre></td></tr>',this.responseCertNode,"only");
        	} else {
        		domConstruct.empty(this.responseCertNode);
        	}
        	foo = this;
        	dc = domConstruct;
        	this._set("model",model);
        },
    });
 
});