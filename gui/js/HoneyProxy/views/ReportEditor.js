define([
    "dojo/_base/declare",
    "codemirror/all",
    "dijit/form/Button",
    "../util/_DynamicTemplatedWidget",
    "dojo/text!./templates/ReportEditor.ejs"
], function(declare, CodeMirrorPromise, Button, _DynamicTemplatedWidget, template) {
 
    return declare([_DynamicTemplatedWidget], {
        templateString: template,
        _onShow: function(){
        	console.log("onShow called");
        	this.codeMirror && this.codeMirror.refresh()        
        },
        postCreate: function(){
        	this.inherited(arguments);
        	
        	var reportCodeNode = this.reportCodeNode;
        	CodeMirrorPromise.then((function(CodeMirror){
        		this.codeMirror = CodeMirror.fromTextArea(reportCodeNode,{
            		lineNumbers: true,
            		mode:  "javascript",
            		matchBrackets: true,
            		extraKeys: {"Enter": "newlineAndIndentContinueComment"},
            		onCursorActivity: function() {
            		    editor.matchHighlight("CodeMirror-matchhighlight");
            		}
            	});
        	}).bind(this));
        	
        	this.startButton = new Button({
        		iconClass: "dijitIcon dijitIconFunction"
        	},this.startButtonNode);
        },
        getCode: function(){
        	return this.codeMirror ? this.codeMirror.getValue() : "";
        }
    });
 
});