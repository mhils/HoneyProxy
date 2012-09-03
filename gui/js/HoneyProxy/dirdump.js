/**
 * Add a small link to the directory listener if dirdump is active.
 */
define(["./config","dojo/domReady!"],function(config){
	if(config.get("dumpdir") === true) {
		$("header").prepend('<a target="_blank" href="/dump">Show dumped files</a>');
	}
	return config.get("dumpdir");
});