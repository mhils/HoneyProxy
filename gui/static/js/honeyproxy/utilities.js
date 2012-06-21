HoneyProxy.getContentTypeFromHeaders = function getContentTypeFromHeaders(headers){
	var contentType = _.find(headers, function(header){
		return !!header[0].match(/Content-Type/i);
	});
	return contentType ? contentType[1].split(";")[0] : undefined;
};
HoneyProxy.log = function(){
	console.log.apply(console,arguments);
}