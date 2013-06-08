define([ "dojo/_base/declare", "dojo/dom-construct", "./_DetailViewPane", 
 "dojo/text!./templates/PreviewPane.ejs" ], function(declare, domConstruct,
	_DetailViewPane, template) {
	return declare([ _DetailViewPane ], {
		templateString: template,
		title: "Preview"
	});
	
});