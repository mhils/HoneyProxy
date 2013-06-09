define(["dojo/dom-construct", "dojo/on", "highlight","./MessageUtils"], function (domConstruct, on, hljs, MessageUtils) {
  var bindings = {};
  
  var askPretty  = 1024 * 15,
      autoPretty = 1024 * 300;
  
  // displayContent factory function.
  // This allows us to specify a transform on the content before it gets handled.
  bindings._displayContent = function(contentTransform){
    return function (type, node, message) {

      if(node._contentLoading) {
        node._contentLoading.cancel("outdated");
      }

      node.classList.remove("preview-empty");
      node.classList.remove("preview-active");
      node.classList.remove("preview-loading");

      function load() {
        node._contentLoading = MessageUtils.getContent(message).then(function (content) {
          delete node._contentLoading;
          content = contentTransform ? contentTransform(content) : content;
          node.textContent = content;
          node.classList.remove("preview-loading");
          node.classList.add("preview-active");

          function prettify() {
            hljs.highlightBlock(node);
          }

          if(message.contentLength < autoPretty) {
            prettify();
          } else if(message.contentLength < askPretty) {
            //FIXME
          }
        });
      }

      if(MessageUtils.hasContent(message)) {
        node.classList.add("preview-loading");
        if(MessageUtils.hasLargeContent(message)) {
          var button = domConstruct.place("<button>Load Content (" + MessageUtils.getContentLengthFormatted(message) + ")</button>", node, "only");
          on(button, "click", load);
        } else {
          load();
        }
      } else {
        node.classList.add("preview-empty");
      }
    };
  };
  
  //no transform by default
  bindings.displayContent = bindings._displayContent();
  
  return bindings;
});