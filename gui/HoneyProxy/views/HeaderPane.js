define([
        "require", 
        "dojo/_base/declare", 
        "dijit/form/Button",
        "../util/_DynamicTemplatedWidget",
        "../MainLayout",
        "../config",
        "dojo/text!./templates/HeaderPane.ejs" ], 
function(require, declare, Button, _DynamicTemplatedWidget, MainLayout, config, template) {
	
	return declare([ _DynamicTemplatedWidget ], {
		templateString: template,
		nodeTag: "header",
		postCreate: function() {
			this.inherited(arguments);
			
			new Button({
				label: "Show Traffic",
				iconClass: "dijitIcon dijitIconTable",
				onClick: function() {
					MainLayout.showPane(0);
				}
			}).placeAt(this.toolbarNode);
			
			new Button({
				label: "Generate Report",
				iconClass: "dijitIcon dijitIconChart",
				onClick: function() {
					MainLayout.showPane(1);
				}
			}).placeAt(this.toolbarNode);
			
			if (config.get("dumpdir") === true) {
				new Button({
					label: "Show dumped files",
					iconClass: "dijitIcon dijitIconFolderOpen",
					onClick: function() {
						MainLayout.showPane(2);
					}
				}).placeAt(this.toolbarNode);
			}
		}
	});
	
});