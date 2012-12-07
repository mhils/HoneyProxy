define([
    "dojo/_base/declare",
    "dijit/form/Button",
    "../util/_DynamicTemplatedWidget",
    "dojo/text!./templates/ReportEditor.ejs"
], function(declare, Button, _DynamicTemplatedWidget, template) {
 
    return declare([_DynamicTemplatedWidget], {
        templateString: template,
        postCreate: function(){
        	this.inherited(arguments);

        	
        	var reportCodeNode = this.reportCodeNode;

        	this.startButton = new Button({
        		iconClass: "dijitIcon dijitIconFunction"
        	},this.startButtonNode);
        },
        getCode: function(){
        	return this.reportCodeNode.value;
        }
    });
 
});