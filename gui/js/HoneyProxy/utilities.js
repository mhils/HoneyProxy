define([],function(){
	return {
		/**
		 * Get the ContentType out of an array of headers (without charset).
		 * @param headers
		 * A [[headnerName,value],[headerName,value]] array of headers.
		 * @returns
		 */
		getContentTypeFromHeaders : function getContentTypeFromHeaders(headers){
			var contentType = _.find(headers, function(header){
				return !!header[0].match(/^Content-Type$/i);
			});
			return contentType ? contentType[1].split(";")[0] : undefined;
		},
		/**
		 * Parse a query string and return its components
		 */
		parseParameters : function(queryString)
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
	};
});

