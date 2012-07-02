HoneyProxy.FlowView = Backbone.View.extend({
	template: undefined,
	tagName: "tr",
	events: {
		"click": HoneyProxy.openPreview
	},
	render: function() {
		if(this.model === undefined)
			return this;
		var html = this.template(this.model);
		this.$el.html(html);
		this.$el.addClass("category-"+this.model.getCategory());
		this.$el.addClass("request-scheme-"+this.model.getRequestScheme());
		return this;
	}
});

$(function(){
	//load template from page html when DOM is ready
	HoneyProxy.FlowView.prototype.template = _.template($("#template-flow").html());
});