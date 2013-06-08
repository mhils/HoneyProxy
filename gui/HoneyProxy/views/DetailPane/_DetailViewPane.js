define(["dojo/_base/declare", "../../util/_ReactiveTemplatedWidget", "../../flow/MessageUtils", "../../flow/RequestUtils", "../../flow/ResponseUtils"], function(declare, _ReactiveTemplatedWidget, MessageUtils, RequestUtils, ResponseUtils) {

	return declare([_ReactiveTemplatedWidget], {
		context: {
			MessageUtils: MessageUtils,
			RequestUtils: RequestUtils,
			ResponseUtils: ResponseUtils
		}
	});

});