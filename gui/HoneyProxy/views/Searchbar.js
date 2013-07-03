define(["dojo/_base/declare",
		"../util/_ReactiveTemplatedWidget",
		"jquery",
		"bootstrap/dropdown",
		"dojo/on",
		"dojo/text!./templates/Searchbar.html",
		"dojo/text!./templates/Searchbar-filterbutton.html"
], function(
	declare,
	_ReactiveTemplatedWidget,
	$,
	dropdown,
	on,
	template,
	templateButton) {

	var FilterButton = declare([_ReactiveTemplatedWidget], {
		templateString: templateButton,
		onClick: function(){
			console.log(this,arguments);
		}
	});

	return declare([_ReactiveTemplatedWidget], {
		templateString: template,
		type: {
			isfilter: true
		},
		constructor: function(){
			this.queries = [new FilterButton({model: {query: "foo", color: "red", isfilter: false}}),new FilterButton({model: {query: "bar", isfilter: true}})]
		},
		postCreate: function(){
			this.inherited(arguments);
			//$(this.searchDropdown).
		},
		dropdownClick: function(event){
			this.type = JSON.parse(event.target.dataset.props);
			this.refresh();
		},
		addClick: function(event){

		}
	});

});