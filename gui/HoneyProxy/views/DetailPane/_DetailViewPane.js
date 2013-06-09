define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../../flow/FlowBindings", "../../flow/MessageUtils", "../../flow/RequestUtils", "../../flow/ResponseUtils"], 
	function(declare, _ReactiveTemplatedWidget, flowBindings, MessageUtils, RequestUtils, ResponseUtils) {

	return declare([_ReactiveTemplatedWidget], {
		context: {
			MessageUtils: MessageUtils,
			RequestUtils: RequestUtils,
			ResponseUtils: ResponseUtils
		},
		requiresModel: true, //FIXME: Temporary workaround. 
		/*
		Problem: _ReactiveTemplatedWidget cannot compile the detailviews if no model is set
		Solution: Lazy-initialize Detailviews. Remove workaround here and in _ReactiveTemplatedWidget as well.
		*/
		bindings: flowBindings
	});

});