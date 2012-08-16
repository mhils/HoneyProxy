define([ "dojo/query",
  "dijit/layout/BorderContainer", 
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane",
  "dojo/domReady!"], function(query, BorderContainer, TabContainer, ContentPane) {
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
	
	var detail = new ContentPane({
        region: "bottom",
        splitter: true,
        layoutPriority:2
    },"detail");
	//appLayout.addChild(detail);
	
	
	appLayout.addChild(
		    new ContentPane({
		        region: "right",
		        splitter: true,
		        layoutPriority:1
		    },"rightCol")
		);
	
	appLayout.startup();
	
	var isDetailAdded = false;
	var MainLayout = {
			appLayout: appLayout,
			openDetail: function(){
				if(isDetailAdded)
					return;
				appLayout.addChild(detail);
				isDetailAdded = true;
			},
			closeDetail: function(){
				if(!isDetailAdded)
					return;
				appLayout.removeChild(detail);
				isDetailAdded = false;
			}
	}
	return MainLayout;
});