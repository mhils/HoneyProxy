define(["dojo/_base/declare", "./_DetailViewPane", "dojo/promise/all",
		"../../utilities", "dojo/text!./templates/RawPane.ejs"
], function(declare,
	_DetailViewPane, all, util, template) {

	var RawPane = declare([_DetailViewPane], {
		title: "Raw",
		templateString: template
	});
	return RawPane;

});