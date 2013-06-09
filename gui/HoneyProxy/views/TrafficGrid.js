define(["dojo/_base/declare",
		"dgrid/OnDemandGrid",
		"dgrid/Keyboard",
		"dgrid/Selection",
		"dgrid/extensions/ColumnResizer",
		"dgrid/extensions/ColumnHider",
		"dgrid/extensions/DijitRegistry",
		"../flow/RequestUtils",
		"../flow/ResponseUtils",
		"dojo/text!./templates/tutorial.html"
], function(declare, OnDemandGrid, Keyboard, Selection, ColumnResizer, ColumnHider, DijitRegistry, RequestUtils, ResponseUtils, tutorial) {

	return declare([OnDemandGrid, Keyboard, Selection, ColumnResizer, ColumnHider, DijitRegistry], {
		columns: [{
				label: "id",
				field: "id",
				hidden: true
			}, {
				label: "Request Path",
				renderCell: function(flow, value, node) {
					//node.textContent = RequestUtils.getFilename(flow.request);
					var filenameNode = document.createElement("div");
					filenameNode.textContent = RequestUtils.getFilename(flow.request);
					node.appendChild(filenameNode);

					var fullPathNode = document.createElement("small");
					fullPathNode.textContent = RequestUtils.getFullPath(flow.request);
					node.appendChild(fullPathNode);
				}
			}, {
				label: "Method",
				get: function(flow) {
					return flow.request.method;
				}
			},{
				label: "Status",
				get: function(flow) {
					return flow.response.code;
				}
			},{
				label: "Type",
				get: function(flow) {
					var contentType = ResponseUtils.getContentType(flow.response);
					if(contentType) {
						var split = contentType.indexOf(";");
						return contentType.substr(0,split === -1 ? undefined : split);
					}
				}
			},{
				label: "Size",
				className: "field-size.text-right",
				get: function(flow) {
					return ResponseUtils.getContentLengthFormatted(flow.response);
				}
			}, {
				label: "Time",
				className: "field-time.text-right",
				renderCell: function(flow, value, node) {
					var date = new Date(flow.request.timestamp_start*1000);
					//ugly but performant
					node.innerHTML = (
						'<div class="timestamp" title="UNIX Timestamp: ' + flow.request.timestamp_start + '">' + 
							date.toLocaleTimeString() + ', ' + ("0"+date.getDate()).slice(-2) + '.' + ("0"+(date.getMonth()+1)).slice(-2) +
						'.</div><div class="duration">' + Math.floor((flow.response.timestamp_end - flow.request.timestamp_start) * 1000) + 'ms</div>');
				}
			}
		],
		selectionMode: "single", // for Selection; only select a single row at a time
		cellNavigation: false,
		noDataMessage: tutorial
	});
});