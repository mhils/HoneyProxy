/**
 * Shows details when clicking on a flow.
 */
define(["dojo/_base/declare",
        "dijit/layout/TabContainer", 
        "dojo/_base/array",
        "./DetailPane/RawPane",
        "./DetailPane/PreviewPane",
        "./DetailPane/DetailsPane"],function(declare,TabContainer,array,RawPane,PreviewPane,DetailsPane) {
	return declare([TabContainer], {
		
		postCreate: function(){
			this.inherited(arguments);
			var preview = PreviewPane();
			var raw = RawPane();
			var details = DetailsPane();
		    this.addChild(preview);
		    this.addChild(details);
		    this.addChild(raw);
		    
		    //Scroll to top when switching tab.
		    this.watch("selectedChildWidget",function(){
		    	this.containerNode.scrollTop = 0;
		    });
		    
		},
		style: "height: 100%; width: 100%;",
		setModel: function(model){
			if(this.model == model)
				return;
			this.model = model;
			array.forEach(this.getChildren(),function(c){
				c.set("model",model);
			});
		}
	});
});