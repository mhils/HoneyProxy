/**
 * Adds basic templating functionality to HoneyProxy.
 * The current implementation is kind of hacky as it is
 * somewhat optimistic about the order of requests and their completion.
 * Each component basically requests a template and hopes that it loaded before
 * it's needed.
 * This works fine so far, although this is clearly bad practice and should be replaced
 * with something like a RequireJS equivalent.
 */
HoneyProxy.templateRoot = "./templates";
HoneyProxy._templates = {};
HoneyProxy.loadTemplate = function(names) {
	if(!_.isArray(names))
		names = [names];
	_.each(names, function(name){
		if (!(name in HoneyProxy._templates))
			jQuery.get(HoneyProxy.templateRoot+"/"+name+".ejs",function(data) {
				HoneyProxy._templates[name] = _.template(data);
			},"text");
	});
};
HoneyProxy.template = function(name,data) {
	if(name in HoneyProxy._templates)
		return HoneyProxy._templates[name](data);
	return "Template not loaded.";
};