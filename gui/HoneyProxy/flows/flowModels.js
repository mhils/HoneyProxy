define([ "./RedirectFlow", "./NotModifiedFlow", "./PEFlow", "./JavaFlow", "./FlashFlow", 
         "./ImageFlow", "./HtmlFlow", "./XmlFlow", "./JsFlow", "./CssFlow", "./PrettyFlow" ],
	function(RedirectFlow, NotModifiedFlow, PEFlow, JavaFlow, FlashFlow, ImageFlow, HtmlFlow, 
      XmlFlow, JsFlow, CssFlow, PrettyFlow) {
		return [ RedirectFlow, NotModifiedFlow, PEFlow, JavaFlow, FlashFlow, ImageFlow, 
		         HtmlFlow, XmlFlow, JsFlow, CssFlow, PrettyFlow];
	});