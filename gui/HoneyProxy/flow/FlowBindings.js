define(["dojo/dom-construct", "dojo/on", "highlight"], function (domConstruct, on, hljs) {
  var bindings = {};
  
  var askPretty  = 1024 * 15,
      autoPretty = 1024 * 300;
  
  bindings.displayContent = function (node, keys, newValue, oldValue, handle) {
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
  bindings.displayContent.key = function(keys){
    keys.push("contentLength");
    return keys;
  }
  return bindings;
});