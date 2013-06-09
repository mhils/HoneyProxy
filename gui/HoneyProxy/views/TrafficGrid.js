define(["dojo/_base/declare", "dgrid/OnDemandGrid", "dgrid/Keyboard", "dgrid/Selection", "../flow/RequestUtils", "dojo/text!./templates/tutorial.html"], function(declare, OnDemandGrid, Keyboard, Selection, RequestUtils, tutorial) {

	return declare([OnDemandGrid, Keyboard, Selection], {
		columns: [{
				label: "id",
				field: "id"
			}, {
				label: "Response Code",
				get: function(message){
					return message.response.code;
				}
			},{
				label: "Request Path",
				get: function(message){
					return RequestUtils.getFullPath(message.request);
				}
			}
		],
		selectionMode: "single", // for Selection; only select a single row at a time
		cellNavigation: false,
		noDataMessage: tutorial
	});
});