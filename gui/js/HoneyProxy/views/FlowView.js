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
		
		var superCls = this.model;
		var categories = []
		while(superCls !== undefined){
			var proto = Object.getPrototypeOf(superCls);
			if(proto.hasOwnProperty("getCategory"))
				categories.push("category-"+superCls.getCategory());
			superCls = superCls.constructor.__super__;
		}
		
		this.$el.addClass(categories.join(" "));
		
		this.$el.addClass("request-scheme-"+this.model.request.scheme);
		for(cls in this.model.getFilterClasses()){
			this.$el.addClass(cls);
		}
		
		this.$filterEl = this.$el.find(".filters");
		this.model.on("filterClass:add",this.onFilterClassAdd.bind(this));
		this.model.on("filterClass:remove",this.onFilterClassRemove.bind(this));

		return this;
	},
	onFilterClassAdd: function(cls){
		var children = this.$filterEl.children();
		var inserted = false;
		for(var i=0;i<children.length && !inserted;i++) {
			var child = $(children[i]);
			if (child.attr("class") > cls) {
				child.before('<div class="'+cls+'"></div>')
				inserted = true;
			}
		}
		if(!inserted)
			this.$filterEl.append('<div class="'+cls+'"></div>')
		return this.$el.addClass(cls);
	},
	onFilterClassRemove: function(cls){
		this.$filterEl.find("."+cls.split(" ").join(".")).remove();
		return this.$el.removeClass(cls);
	}
});

HoneyProxy.loadTemplate("flow");