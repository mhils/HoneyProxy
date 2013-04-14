define(["dojo/_base/declare", "./BasicContentView", "../FlowBindings"], 
         function(declare, BasicContentView, FlowBindings) {
  
  var bindings = FlowBindings; //FIXME: Clone
  bindings.displayContent = FlowBindings._displayContent(function(content){
    try {
      var json = JSON.parse(content);
      return JSON.stringify(json,null,"  ");
    } catch(e){
      return content;
    }
  });
  
  var JavaScriptView = declare([BasicContentView],function(){
    bindings: bindings
  });
  
  JavaScriptView.className = "flow-javascript " + BasicContentView.className;
  JavaScriptView.matches = function(data) {
    if (data.contentType && !!data.contentType.match(/(javascript|json)/i))
      return true;
    else if (data.path)
      return !!data.path.match(/(\.js|\.json)$/i);
    return false;
  };

  return JavaScriptView;
});