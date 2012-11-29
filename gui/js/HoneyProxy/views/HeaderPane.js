define([
    "require",
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/form/Button",
    "../util/_DynamicTemplatedMixin",
    "lodash",
    "../MainLayout",
    "dojo/text!./templates/HeaderPane.ejs"
], function(require,declare, _WidgetBase, Button, _DynamicTemplatedMixin, _, MainLayout, template) {
 
    return declare([_WidgetBase, _DynamicTemplatedMixin], {
    	templateCompileFunction: _.template,
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