/**
 * Second pane - shows details when clicking on a flow.
 * TODO: Lazy-load the tabs.
 */
define(["../MainLayout",
        "dojo/Deferred",
        "dijit/layout/TabContainer", 
        "dijit/layout/ContentPane",
        "./DetailView/RawPane",
        "dojo/text!../templates/preview.ejs",
        "dojo/text!../templates/details.ejs",
        "dojo/text!../templates/raw.ejs",
        "dojo/domReady!"],function(MainLayout,Deferred,TabContainer,ContentPane,RawPane,previewTmpl,detailsTmpl,rawTmpl) {
	
	var previewTemplate = _.template(previewTmpl);
	var detailsTemplate = _.template(detailsTmpl);
	var rawTemplate     = _.template(rawTmpl);
	
	var tc = new TabContainer({
		 style: "height: 100%; width: 100%;"
	},"detail-tabs");
	
    var preview = new ContentPane({
        title: "Preview",
        content: "TBD"
    });
    tc.addChild(preview);
    
    var details = new ContentPane({
        title: "Details",
        content: "TBD",
        onShow: function(){console.warn("details.onShow",this,arguments)}
    });
    tc.addChild(details);

    var raw = RawPane();
    tc.addChild(raw);


    tc.startup();
	
	var currentSelection;
	
	//$(".tabs").tabs();
	
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
			if(this.model == model)
				return;
			this.model = model;
			raw.set("model",model);
			this.render();
		}
	});
});