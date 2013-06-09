define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../../flow/FlowBindings", "../../flow/MessageUtils", "../../flow/RequestUtils", "../../flow/ResponseUtils"], 
	function(declare, _ReactiveTemplatedWidget, flowBindings, MessageUtils, RequestUtils, ResponseUtils) {

	return declare([_ReactiveTemplatedWidget], {
		context: {
			MessageUtils: MessageUtils,
			RequestUtils: RequestUtils,
			ResponseUtils: ResponseUtils
		},
		bindings: flowBindings
	});

});