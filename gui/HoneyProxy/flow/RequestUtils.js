define(["dojo/_base/lang","./MessageUtils"],function(lang,MessageUtils){
	"use strict";

	var RequestUtils = lang.mixin({},MessageUtils);

	RequestUtils.hasFormData = function(request){
		var contentType = RequestUtils.getContentType(request);
		return (
			contentType &&
			RequestUtils.hasContent(request) &&
			contentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i));
	};

	RequestUtils.hasFormData.dependencies = function(TBD){

	};

	//TODO: Add everything else

});