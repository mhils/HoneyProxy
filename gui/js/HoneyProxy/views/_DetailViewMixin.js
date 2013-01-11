define([ "dojo/_base/declare", "dijit/layout/ContentPane", "./DetailPane", ],
	function(declare, ContentPane, DetailPane) {
		return declare([], {
			postCreate: function() {
				
				//Somehow we need to wrap our DetailView in another ContentPane.
				//TODO: investigate why this is necessary
				this.detailViewWrapper = new ContentPane({
					region: "bottom",
					splitter: true,
					style: "height: 300px"//FIXME: Should be in css for #detail. doesnt work currently because of the wrapping
				});
				this.detailView = new DetailPane({});
				this.detailViewWrapper.addChild(this.detailView);
				
			},
			toggleDetails: function(show) {
				if (this.isDetailVisible && this.isDetailVisible == show)
					return;
				if (show)
					this.addChild(this.detailViewWrapper);
				else
					this.removeChild(this.detailViewWrapper);
				this.isDetailVisible = show;
			}
		});
	});