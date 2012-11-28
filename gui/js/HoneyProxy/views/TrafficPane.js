/**
 * Main View
 */
define(["require",
        "dojo/_base/declare",
        "dijit/layout/BorderContainer", 
        "dijit/layout/ContentPane",
        "./TrafficTable",
        "./DetailPane"
        ],function(require,declare,BorderContainer,ContentPane,TrafficTable,DetailPane) {
	return declare([BorderContainer], {
		design: "sidebar",
		postCreate: function(){
			this.inherited(arguments);
			
			var trafficTable = new TrafficTable({
				id: "trafficPane",
				region: "center",
				splitter: true
			});
			
			this.addChild(new ContentPane({
				region: "right",
				splitter: true
			}, "rightCol"));
			
			//Somehow we need to wrap our DetailView in another ContentPane.
			//TODO: investigate why this is necessary
			this.detailViewWrapper = new ContentPane({
				region: "bottom",
				splitter: true,
				style: "height: 300px"//FIXME: Should be in css for #detail. doesnt work currently because of the wrapping
			});
			this.detailView = new DetailPane({}, "detail");
			this.detailViewWrapper.addChild(this.detailView);


			
			//populate trafficPane
			this.addChild(trafficTable);
		},
		currentSelection: undefined,
		/*
		 * TODO: Refactor when refactoring table etc. Just glue currently
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
			if (this.isDetailVisible == show)
				return;
			if(show)
				this.addChild(this.detailViewWrapper);
			else
				this.removeChild(this.detailViewWrapper);
			this.isDetailVisible = show;
		}
	});
});