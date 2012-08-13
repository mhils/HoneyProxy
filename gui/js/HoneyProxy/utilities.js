HoneyProxy.getContentTypeFromHeaders = function getContentTypeFromHeaders(headers){
	var contentType = _.find(headers, function(header){
		return !!header[0].match(/^Content-Type$/i);
	});
	return contentType ? contentType[1].split(";")[0] : undefined;
};
HoneyProxy.log = function(){
	console.log.apply(console,arguments);
}

HoneyProxy.parseParameters = function(queryString)
{
	function _parse(pairStr)
    {
        var param = {};
        var pair = pairStr.split("=", 2);
        param.name = pair[0];
        param.value = (pair.length === 1) ? "" : pair[1];
        return param;
    }
    return queryString.split("&").map(_parse);
}