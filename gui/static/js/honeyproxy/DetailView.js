HoneyProxy.DetailView = Backbone.View.extend({
	templatePreview: undefined,
	templateHeader: undefined,
	render: function() {
		var html = "<h1>Preview</h1>";
		html += this.templatePreview(this.model);
		html += "<h1>Header</h1>";
		html += this.templateHeader(this.model);
		this.$el.html(html);
		return this;
	}
});

$(function(){
	//load template from page html when DOM is ready
	HoneyProxy.DetailView.prototype.templatePreview = _.template($("#template-preview").html());
	HoneyProxy.DetailView.prototype.templateHeader  = _.template($("#template-header").html());
});