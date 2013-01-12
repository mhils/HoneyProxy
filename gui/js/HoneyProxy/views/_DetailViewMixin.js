define([ "dojo/_base/declare", "dojo/dom-construct", "dojo/on", "dijit/layout/ContentPane", "./DetailPane", ],
	function(declare, domConstruct, on, ContentPane, DetailPane) {
		return declare([], {
			postCreate: function() {
				var self = this;
				//Somehow we need to wrap our DetailView in another ContentPane.
				//TODO: investigate why this is necessary
				this.detailViewWrapper = new ContentPane({
					region: "bottom",
					splitter: true,
					style: "height: 300px"//FIXME: Should be in css for #detail. doesnt work currently because of the wrapping
				});
				this.detailView = new DetailPane({});
				this.detailViewWrapper.addChild(this.detailView);
				
				this.detailViewCloseButton = domConstruct.toDom('<span class="dijitInline dijitTabCloseButton dijitTabCloseIcon detailCloseButton" title="Close"></span>');
				
				domConstruct.place(this.detailViewCloseButton, this.detailView.tablist.tablistWrapper, "first");
				on(this.detailViewCloseButton,"click",function(){
					console.log("CloseEvent");
					self.toggleDetails(false);
				});
				
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