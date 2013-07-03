define(["dojo/_base/declare",
		"../util/_ReactiveTemplatedWidget",
		"dojo/text!./templates/TrafficSidebar.ejs"
], function(
	declare,
	_ReactiveTemplatedWidget,
	template) {

	return declare([_ReactiveTemplatedWidget], {
		templateString: template
	});

});