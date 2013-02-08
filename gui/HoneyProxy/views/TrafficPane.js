/**
 * Main traffic view. Shows traffic table, search and details
 */
define(["require",
        "dojo/_base/declare",
        "dijit/layout/BorderContainer", 
        "./TrafficTable",
        "./_DetailViewMixin",
        "./TrafficSidebar"
        ],function(require,declare,BorderContainer,TrafficTable,_DetailViewMixin,TrafficSidebar) {

	return declare([BorderContainer, _DetailViewMixin], {
		design: "sidebar",
		postCreate: function(){
			this.inherited(arguments);
			
			var trafficTable = new TrafficTable({
				id: "trafficPane",
				region: "center",
				splitter: true
			});
			
			var trafficSidebar = new TrafficSidebar({
				region: "right",
				splitter: true
			});

			//populate trafficPane
			this.addChild(trafficTable);
			this.addChild(trafficSidebar);
		},
		currentSelection: undefined,
		/*
		 * TODO: Refactor when refactoring table etc. Just glue currently
		 * Also consider moving the second selectFlow function in ReportPane
		 */
		selectFlow: function(flowId){
			require(["./../traffic","./../MainLayout"],(function(traffic,MainLayout){
				var model = traffic.get(flowId);
				var modelView = MainLayout.trafficView.children[model.cid].$el;
				this.detailView.setModel(model);

				this.toggleDetails(true);
				modelView.addClass("selected");
				if (this.currentSelection) {
					this.currentSelection.removeClass("selected");
				}
				this.currentSelection = modelView;
			}).bind(this));
		},
		toggleDetails: function(show){
			if (this.isDetailVisible && this.isDetailVisible == show)
				return;
			if(show)
				this.addChild(this.detailViewWrapper);
			else
				this.removeChild(this.detailViewWrapper);
			this.isDetailVisible = show;
		}
	});
});