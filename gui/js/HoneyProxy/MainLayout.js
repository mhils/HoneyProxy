define([
	"exports",
	"dojo/query",
	"dijit/layout/BorderContainer", 
	"dijit/layout/TabContainer",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"./views/HeaderPane",
	"./views/TrafficPane",
	"./views/ReportPane",
	"./views/DumpedFilesPane",
	"./views/TrafficView", //Deprecated, refactor to dojo
	"./traffic",
	"dojo/domReady!"
], function(exports,query, BorderContainer, TabContainer, StackContainer, ContentPane, HeaderPane, TrafficPane, ReportPane, DumpedFilesPane, TrafficView, traffic) {
	
	//appLayout covers everything
	var appLayout = new BorderContainer({
		design: "headline",
		liveSplitters: false,
		gutters: false
	}, "appLayout");

	var header = new HeaderPane({
			region: "top",
			id: "header",
			style: "width: 100%;"
		});
	

	//main covers the whole content area, but not the header
	var main = new StackContainer({
		id: "main",
		region: "center"
	});
	
	//populate appLayout
	appLayout.addChild(header);
	appLayout.addChild(main);
	
	
	//Traffic Pane, our default view with search sidebar and traffic table.
	var trafficPane = new TrafficPane({
		liveSplitters: false,
		gutters: false
	});
	
	//Report Pane
	var reportPane = new ReportPane({
		liveSplitters: false,
		gutters: false
	});
	
	//Dumpfiles Browser Pane
	var dumpedFilesPane = new DumpedFilesPane();

	//populate main
	main.addChild(trafficPane);
	main.addChild(reportPane);
	main.addChild(dumpedFilesPane);

	appLayout.startup();
	
	var trafficView = new TrafficView({
		collection: traffic,
		el: $("#trafficTable .data tbody")[0]
	});

	trafficView.$el.on("click", "tr", function() {
		trafficPane.selectFlow($(this).data("flow-id"));
	});
	
	exports.mainContainer = main;
	exports.showPane = function(index){
		main.selectChild(main.getChildren()[index]);
	};
	exports.header = header;
	exports.trafficView = trafficView;
	exports.trafficPane = trafficPane;

	return exports;
});