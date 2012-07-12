HoneyProxy.PrettyFlow = HoneyProxy.DocumentFlow.extend({
	getPreview: function(callback){
		return HoneyProxy.DocumentFlow.prototype.getPreview.call(this, function($pre){
			$pre.addClass("prettyprint linenums");
			
			var autoPretty = 1024*15, 
			askPretty = 1024*300, //don't even try to highlight very big files.
			contentLength = $pre.html().length;
			console.warn(contentLength);
			if(contentLength < autoPretty) {
				window.setTimeout(prettyPrint,1);
			} else if(contentLength < askPretty){
				$pre.before($("<div>").addClass("pre-menu-item").text("Prettify (slow)").click(function(){
					prettyPrint();
					$(this).hide('slow');
				}));
			}
		});
	}
});
