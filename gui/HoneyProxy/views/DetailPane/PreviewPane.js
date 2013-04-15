define([ "dojo/_base/declare", "dojo/dom-construct", "./_DetailViewPane", 
 "dojo/text!./templates/PreviewPane.ejs" ], function(declare, domConstruct,
	_DetailViewPane, template) {
	return declare([ _DetailViewPane ], {
		templateString: template,
		title: "Preview",
		loadContent: function() {
			
			var model = this.get("model");
			var view = model.View({model: model});
			
			domConstruct.place(view.domNode, this.previewNode, "only");
		}
	});
	
});