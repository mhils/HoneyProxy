define(["dojo/_base/declare",
		"../util/Observer",
		"../util/_ReactiveTemplatedWidget",
		"dojo/text!./templates/Searchbar.html",
		"dojo/text!./templates/Searchbar-filterbutton.html"
], function(
	declare,
	Observer,
	_ReactiveTemplatedWidget,
	template,
	templateButton) {

	var FilterButton = declare([_ReactiveTemplatedWidget], {
		templateString: templateButton,
		empty: true,
		value: function() {
			return this.inputNode.value.trim();
		},
		onSubmit: function(event) {
			event.preventDefault();
			if (this.query !== this.value()) {
				this.query = this.value();
				this.notify({name: "query"});
				this.onBlur();
			}
		},
		onInput: function() {
			this.empty = (this.value() === "");
			this.updateBindings();
		},
		onBlur: function() {
			this.highlightSubmit = (this.value() !== this.query);
			this.updateBindings();
		}
	});

	return declare([_ReactiveTemplatedWidget], {
		templateString: template,
		type: {
			isfilter: true
		},
		constructor: function() {
			this.filters = [];
			this.colors = ["#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#1f77b4", "#bcbd22", "#17becf",
					"#ffbb78", "#98df8a", "#ff9896", "#c5b0d5", "#aec7e8", "#dbdb8d", "#9edae5"
			];
		},
		postCreate: function() {
			this.inherited(arguments);
			this.addFilter({
				filter: true,
				fixed: true,
				alwaysVisible: true
			});
			this.addFilter({
				color: this.colors.shift(),
				fixed: true,
				alwaysVisible: true
			});
		},
		addFilter: function(options) {
			var self = this;
			var filter = new FilterButton(options);
			this.own(Observer.observe(filter, function(records) {
				if (records.name === "query")
					self.onSubmit(filter);
			},true));
			this.filters.push(filter);
			this.filtersNode.style.opacity = 0;
			this.filtersNode.appendChild(filter.domNode);
			this.filtersNode.style.opacity = 1;
			this.updateBindings();
		},
		removeFilter: function(filter) {
			this.colors.unshift(filter.color);
			filter.destroyRecursive(false);
			this.filters.splice(this.filters.indexOf(filter), 1);
			this.updateBindings();
		},
		onSubmit: function(filter) {
			var last = this.filters[this.filters.length - 1];
			var secondToLast = this.filters[this.filters.length - 2];

			//remove filter if empty and not last
			if (!filter.fixed && filter.empty && last !== filter) {
				this.removeFilter(filter);
			} else if (!last.fixed && last.empty && secondToLast.empty) {
				//Remove last one if we just cleared either the last one or the second last one
				this.removeFilter(last);
			}
			//Add new one if last one has content
			if (!last.empty && this.colors.length > 0) {
				this.addFilter({
					color: this.colors.shift()
				});
			}
			this.getParent().resize();

			var query = {};
			this.filters.forEach(function(filter) {
				var name = filter.filter ? "filter" : filter.color;
				if(filter.query){
					query[name] = filter.query;
				}
			});
			this.query = query;
			this.notify({name:"query"});
		}
	});

});