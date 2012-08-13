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