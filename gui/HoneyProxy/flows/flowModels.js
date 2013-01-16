define([ "./RedirectFlow", "./NotModifiedFlow", "./ImageFlow", "./HtmlFlow",
		"./XmlFlow", "./JsFlow", "./CssFlow", "./PrettyFlow", "./DocumentFlow" ],
	function(NotModifiedFlow, ImageFlow, HtmlFlow, XmlFlow, JsFlow, CssFlow,
		PrettyFlow, DocumentFlow) {
		return [ NotModifiedFlow, ImageFlow, HtmlFlow, XmlFlow, JsFlow, CssFlow,
				PrettyFlow, DocumentFlow ];
	});