//All dependencies are cached by the AMD loader by default.
//Dirty Hack to uncache
for(k in require.modules) 
  k.indexOf("ReportScripts") === 0 && delete require.modules[k];

require(["ReportScripts/misc/dep"], function(dep) {
  outNode.textContent = dep+"!";
});