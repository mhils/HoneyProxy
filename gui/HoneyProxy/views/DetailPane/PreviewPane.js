define([ "./_DetailViewPane", "dojo/text!./templates/PreviewPane.ejs" ], function(_DetailViewPane, template) {
	return _DetailViewPane.createSubclass([],{
		templateString: template,
		title: "Preview"
	});
});