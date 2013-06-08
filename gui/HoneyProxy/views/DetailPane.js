/**
 * Shows details when clicking on a flow.
 */
define(["dojo/_base/declare", "dijit/layout/TabContainer", "dojo/_base/array",
		"./DetailPane/RawPane", "./DetailPane/PreviewPane",
		"./DetailPane/DetailsPane"
], function(
	declare, TabContainer, array, RawPane, PreviewPane, DetailsPane) {

	return declare([TabContainer], {
		postCreate: function() {
			this.inherited(arguments);
			var preview = new PreviewPane();
			var raw = new RawPane();
			var details = new DetailsPane();
			this.addChild(preview);
			this.addChild(details);
			this.addChild(raw);

			this.domNode.classList.add("detailPane");
			//Scroll to top when switching tab.
			this.watch("selectedChildWidget", function() {
				this.containerNode.scrollTop = 0;
			});

		},
		style: "height: 100%; width: 100%;",
		setModel: function(model) {
			if (this.get("model") == model)
				return;
			this.set("model", model);
			array.forEach(this.getChildren(), function(c) {

				if(!c.notify) { /*FIXME: Remove legacy */
					c.set("model",model);


					return
				}
				var oldValue = c.model;
				c.model = model;
				if (oldValue) {
					c.notify({
						type: "updated",
						object: c,
						name: "model",
						oldValue: oldValue
					});
				} else {
					c.notify({
						type: "new",
						object: c,
						name: "model",
					});
				}

			});
		}
	});
});