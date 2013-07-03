/**
 * Main traffic view. Shows traffic table, search and details
 */
define(["dojo/aspect",
		"dojo/_base/declare",
		"dijit/layout/BorderContainer",
		"../util/Observer",
		"./_DetailViewMixin",
		"dijit/layout/ContentPane",
		"./Searchbar",
		"./TrafficGrid",
		"./TrafficSidebar",
		"HoneyProxy/traffic"
], function(aspect, declare, BorderContainer, Observer, _DetailViewMixin, ContentPane, Searchbar, TrafficGrid, TrafficSidebar, flowStore) {

	return declare([BorderContainer, _DetailViewMixin], {
		design: "sidebar",
		postCreate: function() {
			var self = this;

			this.inherited(arguments);

			//Searchbar
			this.searchbar = new Searchbar({
				region: "top",
				splitter: false
			});
			this.own(Observer.observe(this.searchbar,function(record){
				if(record.name === "query")
					self.grid.set("query",self.searchbar.query);
			},true));
			this.addChild(this.searchbar);

			//Main Traffic Grid
			this.grid = new TrafficGrid({
				store: flowStore
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

			//Grid Pane Wrapper
			this.gridPane = new ContentPane({
				region: "center",
				splitter: true,
				content: this.grid
			});
			this.addChild(this.gridPane);

			/*
			//Sidebar
			this.sidebar = new TrafficSidebar({
				region: "right",
				splitter: true
			});
			this.addChild(this.sidebar);
			*/
		}
	});
});