/**
 * Second pane - shows details when clicking on a flow.
 * TODO: Lazy-load the tabs.
 */
define(["../MainLayout",
        "dojo/Deferred",
        "dojo/text!../templates/preview.ejs",
        "dojo/text!../templates/details.ejs",
        "dojo/text!../templates/raw.ejs",
        "dojo/domReady!"],function(MainLayout,Deferred,previewTmpl,detailsTmpl,rawTmpl) {
	
	var previewTemplate = _.template(previewTmpl);
	var detailsTemplate = _.template(detailsTmpl);
	var rawTemplate     = _.template(rawTmpl);
	
	var currentSelection;
	
	$(".tabs").tabs();
	
	return Backbone.View.extend({
		render: function() {
			//TODO: Interfering the model from a view is terrible and should be changed ASAP.
			this.model._domPromise = new Deferred();
			this.model.foo = "bar";
			this._$details = this._$details || this.$el.find("#details");
			this._$details.html(detailsTemplate(this.model));
			
			this._$preview = this._$preview || this.$el.find("#preview");
			this._$preview.html(previewTemplate(this.model));
			
			this._$raw = this._$raw || this.$el.find("#raw");
			this._$raw.html(rawTemplate(this.model));
			
			this.model._domPromise.resolve();
			delete this.model._domPromise;
			return this;
		},
		setModel: function(model){
			this.model = model;
			this.render();
		}
	});
});