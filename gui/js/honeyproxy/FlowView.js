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
		for(cls in this.model.getFilterClasses()){
			this.$el.addClass(cls);
		}
		//this.model.on("filterClass:add",);
		this.model.on("filterClass:add",this.$el.addClass.bind(this.$el));
		this.model.on("filterClass:remove",this.$el.removeClass.bind(this.$el));
		//this.model._flowView = this;
		return this;
	},
	hide: function(){
		return this.$el.addClass("filteredOut");
	},
	show: function(){
		return this.$el.removeClass("filteredOut");
	},
	setFilteredOut: function(b){
		return b ? this.hide() : this.show();
	}
});

HoneyProxy.loadTemplate("flow");