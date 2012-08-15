require([ "dojo/query","dijit/layout/BorderContainer", "dijit/layout/ContentPane",
		"dojo/domReady!" ], function(query, BorderContainer, ContentPane) {
	var appLayout = new BorderContainer({
		design : "headline",
		liveSplitters: false,
		gutters: false
	}, "appLayout");
	
	appLayout.addChild(
		    new ContentPane({
		        region: "top",
		    },"header")
		)
	appLayout.addChild(
		    new ContentPane({
		        region: "center",
		        splitter: true
		    },"main")
		);
	appLayout.addChild(
		    new ContentPane({
		        region: "bottom",
		        splitter: true,
		        layoutPriority:2
		    },"detail")
		);
	appLayout.addChild(
		    new ContentPane({
		        region: "right",
		        splitter: true,
		        layoutPriority:1
		    },"rightCol")
		);
	
	appLayout.startup();
});