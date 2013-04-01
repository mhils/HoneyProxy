define([ "./RedirectFlow", "./NotModifiedFlow", "./PEFlow", "./ImageFlow", "./HtmlFlow",
		"./XmlFlow", "./JsFlow", "./CssFlow", "./PrettyFlow" ],
	function(RedirectFlow, NotModifiedFlow, PEFlow, ImageFlow, HtmlFlow, XmlFlow, JsFlow, CssFlow,
		PrettyFlow) {
		return [ RedirectFlow, NotModifiedFlow, PEFlow, ImageFlow, HtmlFlow, XmlFlow, JsFlow, CssFlow,
				PrettyFlow];
	});