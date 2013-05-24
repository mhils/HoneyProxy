define(["dojo/_base/declare", "dojo/_base/lang", "./BasicContentView", "../FlowBindings"], 
         function(declare, lang, BasicContentView, FlowBindings) {
  
  var jsBindings = lang.mixin({}, FlowBindings);
  jsBindings.displayContent = FlowBindings._displayContent(function(content){
    try {
      var json = JSON.parse(content);
      return JSON.stringify(json,null,"  ");
    } catch(e){
      return content;
    }
  });
  
  var JavaScriptView = declare([BasicContentView],{
    bindings: jsBindings
  });
  
  JavaScriptView.className = "flow-javascript " + BasicContentView.className;
  JavaScriptView.matches = BasicContentView.simpleMatcher(/(javascript|json)/i, /(\.js|\.json)$/i);

  return JavaScriptView;
});