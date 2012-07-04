HoneyProxy.DetailView = Backbone.View.extend({
	templatePreview: undefined,
	templateHeader: undefined,
	templateRaw: undefined,
	render: function() {
		this._$header = this._$header || this.$el.find("#header");
		this._$header.html(this.templateHeader(this.model));
		
		this._$preview = this._$preview || this.$el.find("#preview");
		this._$preview.html(this.templatePreview(this.model));
		
		this._$raw = this._$raw || this.$el.find("#raw");
		this._$raw.html(this.templateRaw(this.model));
		
		return this;
	}
});

$(function(){
	//load template from page html when DOM is ready
	HoneyProxy.DetailView.prototype.templatePreview = _.template($("#template-preview").html());
	HoneyProxy.DetailView.prototype.templateHeader  = _.template($("#template-header").html());
	HoneyProxy.DetailView.prototype.templateRaw     = _.template($("#template-raw").html());
});