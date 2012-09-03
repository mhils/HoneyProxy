/**
 * View class for a Flow or one of its subclasses.
 */
define(["../detailView","dojo/text!../../templates/flow.ejs"],function(detailView,flowTmpl){
	var flowTemplate = _.template(flowTmpl);
	
	return Backbone.View.extend({
		tagName: "tr",
		events: {
			"click": detailView.setModel.bind(detailView)
		},
		render: function() {
			if(this.model === undefined)
				return this;
			var html = flowTemplate(this.model);
			this.$el.html(html);
			
			//iterate through all parent classes to get their categories and add them as classes
			var superCls = this.model;
			var categories = []
			while(superCls !== undefined){
				if(superCls.constructor.hasOwnProperty("getCategory"))
				{
					var cat = "category-"+superCls.constructor.getCategory();
					if(categories.length == 0 || (cat != categories[categories.length -1] && cat != "category-none"))
						categories.push(cat);
				}
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
	
});