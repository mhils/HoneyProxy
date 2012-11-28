define([
  "dojo/query", 
  "dijit/layout/BorderContainer", 
  "dijit/layout/TabContainer",
  "dijit/layout/StackContainer",
  "dijit/layout/ContentPane",
  "./views/TrafficPane",
  "./views/TrafficView", //Deprecated, refactor to dojo
  "./traffic",
  "dojo/domReady!"], function(query, BorderContainer, TabContainer, StackContainer, ContentPane, TrafficPane, TrafficView, traffic) {

	//appLayout covers everything
	var appLayout = new BorderContainer({
		design: "headline",
		liveSplitters: false,
		gutters: false
	}, "appLayout");

	var header = new ContentPane({
			region: "top",
		}, "header");
	

	//main covers the whole content area, but not the header
	var main = new StackContainer({
		id: "main",
		region: "center"
	});
	
	//populate appLayout
	appLayout.addChild(main);
	appLayout.addChild(header);
	
	//Traffic Pane, our default view with search sidebar and traffic table.
	var trafficPane = new TrafficPane({
		liveSplitters: false,
		gutters: false
	});
	
	//Report Pane
	var reportPane = new ContentPane({}, "reportPane");

	//populate main
	main.addChild(trafficPane);
	main.addChild(reportPane);

	appLayout.startup();
	
	//FIXME: Debug
	window.trafficPane = trafficPane;
	window.main = main;
	
	
	var trafficView = new TrafficView({
		collection: traffic,
		el: $("#trafficTable .data tbody")[0]
	});

	trafficView.$el.on("click", "tr", function(e) {
		trafficPane.selectFlow($(this).data("flow-id"));
	});
	
	//TODO: Still neccessary?
	var MainLayout = {
		trafficView: trafficView,
		trafficPane: trafficPane,
		appLayout: appLayout
	}
	return MainLayout;
});