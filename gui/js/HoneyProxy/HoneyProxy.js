var HoneyProxy = {
		/**
		 * Array containing all Subclasses of the Flow Model.
		 */
		flowModels:[],
		/**
		 * Stores the currently selected row.
		 */
		currentSelection: undefined,
		/**
		 * Updates the DetailView when a row is selected
		 */
		openPreview: function(){
			HoneyProxy.detailView.model = this.model;
			HoneyProxy.detailView.render();
			HoneyProxy.MainLayout.splitpaneResizer.openSecond();
			this.$el.addClass("selected");
			if(HoneyProxy.currentSelection){
				HoneyProxy.currentSelection.$el.removeClass("selected");
			}
			HoneyProxy.currentSelection = this;
		}
};

//HoneyProxy acts as a general event handler (onConfigLoaded, authenticated, newflow, ...)
_.extend(HoneyProxy, Backbone.Events);

//debug
window.HoneyProxy = HoneyProxy;

$(function(){

	//initialize traffic object
	HoneyProxy.traffic = new HoneyProxy.Traffic;
	HoneyProxy.on("newflow",HoneyProxy.traffic.add.bind(HoneyProxy.traffic));
	
	//establish websocket communication after config has been loaded.
	HoneyProxy.on("configLoaded",function(){
		HoneyProxy.websocket.initialize();
	})
	
	//fetch traffic after websocket authentication
	HoneyProxy.on("authenticated",function(){
		console.time("fetch");
		HoneyProxy.traffic.fetch();
	});
	
	
	//provide firstflow event
	function firstFlowTrigger(reset,traffic){
		if(HoneyProxy.traffic.length > 0) {
			HoneyProxy.trigger("firstflow");
			HoneyProxy.off("firstflow");
			HoneyProxy.off("newflow",firstFlowTrigger);
			HoneyProxy.traffic.off("reset",firstFlowTrigger);
		}
	}
	HoneyProxy.on("newflow",firstFlowTrigger);
	HoneyProxy.traffic.on("reset",firstFlowTrigger);

	
	//initialize views
	HoneyProxy.trafficView = new HoneyProxy.TrafficView({collection: HoneyProxy.traffic, el: $("#traffic")[0]});		
	HoneyProxy.detailView = new HoneyProxy.DetailView({el: $("#detail")});
});