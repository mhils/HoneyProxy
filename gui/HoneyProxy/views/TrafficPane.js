/**
 * Main traffic view. Shows traffic table, search and details
 */
define(["require",
		"dojo/_base/declare",
		"dijit/layout/BorderContainer",
		"dijit/layout/ContentPane",
		"./TrafficGrid",
		"./_DetailViewMixin",
		"./TrafficSidebar",
		"HoneyProxy/traffic"
], function(require, declare, BorderContainer, ContentPane, TrafficGrid, _DetailViewMixin, TrafficSidebar, flowStore) {

	return declare([BorderContainer, _DetailViewMixin], {
		design: "sidebar",
		postCreate: function() {
			this.inherited(arguments);

			this.gridPane = new ContentPane({
				region: "center",
				splitter: true
			});

			this.grid = new TrafficGrid({store: flowStore}, this.gridPane.domNode);

			this.grid.on("dgrid-select", this.onSelect.bind(this));

			this.grid.startup();

			var trafficSidebar = new TrafficSidebar({
				region: "right",
				splitter: true
			});

			//populate trafficPane
			this.addChild(this.gridPane);
			this.addChild(trafficSidebar);
		},
		onSelect: function(event) {
			var flow = event.rows[0].data;
			if(flow) {
				if(event.parentType !== "cellfocusin")
					this.toggleDetails(true);
				this.detailView.setModel(flow);
			}
		}
	});
});