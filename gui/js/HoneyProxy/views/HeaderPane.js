define([
    "require",
    "dojo/_base/declare",
    "dijit/form/Button",
    "../util/_DynamicTemplatedWidget",
    "../MainLayout",
    "dojo/text!./templates/HeaderPane.ejs"
], function(require, declare, Button, _DynamicTemplatedWidget, MainLayout, template) {
 
    return declare([_DynamicTemplatedWidget], {
        templateString: template,
        nodeTag: "header",
        postCreate: function(){
        	this.inherited(arguments);
        	
        	//Styling of the buttons
        	this.domNode.classList.add("dijitToolbar");
        	
        	new Button({
        		label: "Generate Report",
        		iconClass: "dijitIcon dijitIconChart",
        		onClick: function(){
        			MainLayout.showPane(1);
        		}
        	}).placeAt(this.toolbarNode);
        	new Button({
        		label: "Show Traffic",
        		iconClass: "dijitIcon dijitIconTable",
        		onClick: function(){
        			MainLayout.showPane(0);
        		}
        	}).placeAt(this.toolbarNode);
        }
    });
 
});