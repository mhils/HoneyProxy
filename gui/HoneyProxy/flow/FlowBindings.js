define(["dojo/dom-construct", "dojo/on", "highlight"], function (domConstruct, on, hljs) {
  var bindings = {};
  
  var askPretty  = 1024 * 15,
      autoPretty = 1024 * 300;
  
  // displayContent factory function.
  // This allows us to specify a transform on the content before it gets handled.
  bindings._displayContent = function(contentTransform){
    var func = function (type, node, keys, newValue, oldValue, handle) {
      var data = this.model[keys[0]];

      if(handle && handle.loading) {
        handle.loading.cancel("outdated");
      }

      node.classList.remove("preview-empty");
      node.classList.remove("preview-active");
      node.classList.remove("preview-loading");

      function load() {
        handle.loading = data.getContent().then(function (content) {
          delete handle.loading;
          content = contentTransform ? contentTransform(content) : content;
          node.textContent = content;
          node.classList.remove("preview-loading");
          node.classList.add("preview-active");

          function prettify() {
            hljs.highlightBlock(node);
          }
          prettify();
          if(data.contentLength < autoPretty) {
            //prettify();
          } else if(data.contentLength < askPretty) {

          }
        });
      }

      if(data.hasContent) {
        node.classList.add("preview-loading");
        if(data.hasLargeContent) {
          var button = domConstruct.place("<button>Load Content (" + data.contentLengthFormatted + ")</button>", node, "only");
          on(button, "click", load);
        } else {
          load();
        }
      } else {
        node.classList.add("preview-empty");
      }
    };
    func.key = function(keys){
      keys.push("contentLength");
      return keys;
    };
    return func;
  };
  
  //no transform by default
  bindings.displayContent = bindings._displayContent();
  
  
  var eventListenerBinding = function(type, node, keys, newValue, oldValue, handle){
    var self = this;
    var func = this;
    while(keys.length) {
      func = func[keys.shift()];
    }
    
    //TODO: Maybe use dojo/on?
    node.addEventListener(type,function(){
      func.apply(self,Array.prototype.slice.call(arguments)); //TODO: Maybe call with different args?
    });
    handle.remove();
    
  };
  
  ["click","load"].forEach(function(event){
    bindings[event] = eventListenerBinding;
  });
  
  return bindings;
});