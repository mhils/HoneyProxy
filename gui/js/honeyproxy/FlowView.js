HoneyProxy.FlowView = Backbone.View.extend({
	tagName: "tr",
	events: {
		"click": HoneyProxy.openPreview
	},
	render: function() {
		if(this.model === undefined)
			return this;
		var html = HoneyProxy.template("flow",this.model);
		this.$el.html(html);
		this.$el.addClass("category-"+this.model.getCategory());
		this.$el.addClass("request-scheme-"+this.model.request.scheme);
		return this;
	}
});

HoneyProxy.loadTemplate("flow");