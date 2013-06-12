define(["dojo/_base/declare",
		"./_PopoutMixin",
		"../util/_ReactiveTemplatedWidget",
		"dojo/text!./templates/ReportOutput.html"
], function(declare, _PopoutMixin, _ReactiveTemplatedWidget, template) {

	return declare([_ReactiveTemplatedWidget, _PopoutMixin], {
		templateString: template
	});

});