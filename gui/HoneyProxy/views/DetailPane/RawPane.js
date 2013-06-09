define([ "./_DetailViewPane", "dojo/text!./templates/RawPane.ejs" ], function(_DetailViewPane, template) {
	return _DetailViewPane.createSubclass([],{
		templateString: template,
		title: "Raw"
	});
});