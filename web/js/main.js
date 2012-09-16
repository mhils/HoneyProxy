//Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34869249-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
  
$(document).on('click',"a",function(e){
	var url = $(this).attr("href");
	if (e.currentTarget.host != window.location.host) {
		var target = $(this).attr("target");
		_gaq.push(['_trackEvent', 'Outbound Links', e.currentTarget.host, url, 0]);
		if (e.metaKey || e.ctrlKey || target=="_blank") {
			var newtab = true;
			}
		if (!newtab) {
			e.preventDefault();
			setTimeout('document.location = "' + url + '"', 100);
			}
		}
	});
