/**
 * Second pane - shows details when clicking on a flow.
 * TODO: Lazy-load the tabs.
 */
define(["../MainLayout",
        "dojo/text!../../templates/preview.ejs",
        "dojo/text!../../templates/details.ejs",
        "dojo/text!../../templates/raw.ejs",
        "dojo/domReady!"],function(MainLayout,previewTmpl,detailsTmpl,rawTmpl) {
	
	var previewTemplate = _.template(previewTmpl);
	var detailsTemplate = _.template(detailsTmpl);
	var rawTemplate     = _.template(rawTmpl);
	
	var currentSelection;
	
	$(".tabs").tabs();
	
	return Backbone.View.extend({
		render: function() {
			this._$details = this._$details || this.$el.find("#details");
			this._$details.html(detailsTemplate(this.model));
			
			this._$preview = this._$preview || this.$el.find("#preview");
			this._$preview.html(previewTemplate(this.model));
			
			this._$raw = this._$raw || this.$el.find("#raw");
			this._$raw.html(rawTemplate(this.model));
			
			return this;
		},
		setModel: function(model){
			console.warn(arguments);
			//FIXME resolve
			this.model = model;//this.model;
			this.render();
			MainLayout.openDetail();
			this.model.$el.addClass("selected");
			if(currentSelection){
				currentSelection.$el.removeClass("selected");
			}
			currentSelection = this.model;
		}
	});
});