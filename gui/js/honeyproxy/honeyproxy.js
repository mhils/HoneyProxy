var HoneyProxy = {
		flowModels:[],
		currentSelection: undefined,
		templateRoot: "/app/templates",
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
	
_.extend(HoneyProxy, Backbone.Events);

//debug
window.HoneyProxy = HoneyProxy;

$(function(){
	

	
	//$("#splitter").height($(window).height());
	
	//$("#splitter").splitter({outline: true,sizeLeft: $(window).width()-100, minLeft: 500});
	
	HoneyProxy.traffic = new HoneyProxy.Traffic;
	
	HoneyProxy.on("newflow",HoneyProxy.traffic.add.bind(HoneyProxy.traffic));
	
	HoneyProxy.on("authenticated",function(){
		console.time("fetch");
		HoneyProxy.traffic.fetch();
	});
	
	HoneyProxy.on("configLoaded",function(){
		HoneyProxy.websocket.initialize();
	})
	
	HoneyProxy.trafficView = new HoneyProxy.TrafficView({collection: HoneyProxy.traffic, el: $("#traffic")[0]});		
	HoneyProxy.detailView = new HoneyProxy.DetailView({el: $("#detail")});
});