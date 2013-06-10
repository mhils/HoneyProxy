define(["dojo/_base/declare",
		'dojo/aspect',
		"./DetailPane"
], function(declare, aspect, DetailPane) {
	return declare([], {
		showDetails: function(flow) {
			console.log("Show details...");

			var self = this;

			if (this.detailView) {
				this.detailView.setModel(flow);
			} else {
				this.detailView = new DetailPane({
					region: "bottom",
					splitter: true
				});
				this.detailView.setModel(flow);
				aspect.before(this.detailView,"destroy",function(){
					self.removeChild(self.detailView);
					delete self.detailView;
				});
				this.addChild(this.detailView);
			}
		}
	});
});