define([ "dojo/_base/declare", "./_DetailViewPane", "dojo/dom-construct",
	"dojo/Deferred", "dojo/text!./templates/PreviewPane.ejs" ], function(declare,
	_DetailViewPane, domConstruct, Deferred, template) {
	return declare([ _DetailViewPane ], {
		templateString: template,
		title: "Preview",
		loadContent: function() {
			
			var model = this.get("model");
			
			//Check if there is still a pending request for generating a preview.
			//If so, cancel it.
			var lastRequest = this.get("previewRequest");
			if (lastRequest)
				lastRequest.cancel("outdated");
			
			var previewPane = this;
			
			this.set("previewHTML",model.View({model: model}));
			/*
			var previewFunc = model.getPreview.bind(model);
			
			var deferred = new Deferred();
			
			var previewRequest = previewFunc().then(function(previewHTML) {
				previewPane.set("previewHTML", previewHTML);
				deferred.resolve(true);
			});
			this.set("previewRequest", previewRequest);
			return deferred;*/
		},
		
		previewHTML: undefined,
		_setPreviewHTMLAttr: function(previewHTML) {
			domConstruct.place(previewHTML.domNode, this.previewHTMLNode, "only");
			this._set("previewHTML", previewHTML);
		}
	});
	
});