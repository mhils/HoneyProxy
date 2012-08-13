/**
 * Second pane - shows details when clicking on a flow.
 * TODO: Lazy-load the tabs.
 */
HoneyProxy.DetailView = Backbone.View.extend({
	render: function() {
		this._$details = this._$details || this.$el.find("#details");
		this._$details.html(HoneyProxy.template("details",this.model));
		
		this._$preview = this._$preview || this.$el.find("#preview");
		this._$preview.html(HoneyProxy.template("preview",this.model));
		
		this._$raw = this._$raw || this.$el.find("#raw");
		this._$raw.html(HoneyProxy.template("raw",this.model));
		
		return this;
	}
});

HoneyProxy.loadTemplate(["preview","details","raw"]);
$(function(){
	$(".tabs").tabs();
})