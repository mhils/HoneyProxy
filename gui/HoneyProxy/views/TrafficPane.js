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
			var self = this;

			this.inherited(arguments);

			this.grid = new TrafficGrid({
				store: flowStore
			});

			this.gridPane = new ContentPane({
				region: "center",
				splitter: true,
				content: this.grid
			});

			this.sidebar = new TrafficSidebar({
				region: "right",
				splitter: true
			});


			//Wire Grid Selection to DetailView
			this.grid.on("dgrid-select", function(event) {
				//if details have been hidden, don't open them on keyboard navigation
				if(event.parentType === "dgrid-cellfocusin" && !self.detailView)
					return;
				var flow = event.rows[0].data;
				self.showDetails(flow);
			});
			this.grid.addKeyHandler(27, function() { //ESC
				if(self.detailView)
					self.detailView.destroyRecursive();
			});
			this.grid.addKeyHandler(13, function() { //ENTER
				var selectedRow = Object.keys(self.grid.selection)[0];
				self.showDetails(self.grid.row(selectedRow).data);
			});



			//populate trafficPane
			this.addChild(this.gridPane);
			this.addChild(this.sidebar);
		}
	});
});