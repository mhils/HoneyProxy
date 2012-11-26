/**
 * Second pane - shows details when clicking on a flow.
 * TODO: Lazy-load the tabs.
 */
define(["dojo/_base/declare",
        "dijit/layout/TabContainer", 
        "dojo/_base/array",
        "./DetailView/RawPane",
        "./DetailView/PreviewPane",
        "./DetailView/DetailsPane"],function(declare,TabContainer,array,RawPane,PreviewPane,DetailsPane) {
	return declare([TabContainer], {
		
		postCreate: function(){
			this.inherited(arguments);
			var preview = PreviewPane();
			var raw = RawPane();
			var details = DetailsPane();
		    this.addChild(preview);
		    this.addChild(raw);
		    this.addChild(details);
		    this.set("raw",raw);
		    this.set("preview",preview)
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
    
    
    /* TODO: Add again
    var details = new ContentPane({
        title: "Details",
        content: "TBD",
        onShow: function(){console.warn("details.onShow",this,arguments)}
    });
    tc.addChild(details); */

	//$(".tabs").tabs();
	/*
	return Backbone.View.extend({
		render: function() {
			//TODO: Interfering the model from a view is terrible and should be changed ASAP.
			this.model._domPromise = new Deferred();

			this._$details = this._$details || this.$el.find("#details");
			this._$details.html(detailsTemplate(this.model));
			
			this._$preview = this._$preview || this.$el.find("#preview");
			this._$preview.html(previewTemplate(this.model));
			
			this._$raw = this._$raw || this.$el.find("#raw");
			this._$raw.html(rawTemplate(this.model));
			
			this.model._domPromise.resolve();
			delete this.model._domPromise;
			return this;
		},
		setModel: function(model){
			
		}
	});*/
});