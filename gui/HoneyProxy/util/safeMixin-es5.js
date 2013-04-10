//Patch dojo/_base/declare to copy ES5 getters and setters properly
define(["dojo/_base/declare"],function(declare){

  console.debug("Patching dojo/_base/declare.safeMixin...");

  var op = Object.prototype, cname = "constructor", opts = Object.prototype.toString;

  declare.safeMixin = function safeMixin(target, source){
		var name, t;
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
        var _source = source;
        var descriptor = Object.getOwnPropertyDescriptor(_source, name);
				while (descriptor === undefined) {
          _source = Object.getPrototypeOf(_source);
					descriptor = Object.getOwnPropertyDescriptor(_source, name);
				}
        Object.defineProperty(target, name, descriptor)
			}
		}
		return target;
	}
});