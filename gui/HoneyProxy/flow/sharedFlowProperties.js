/**
 * Contains shared methods of Request and Response objects. Stateless.
 */
define(["lodash","dojo/Deferred","../util/formatSize"],function(_,Deferred,formatSize){
  
  function contentUrl(data,action){
    return ("/files"+
            "/"+data._flow.id+
            "/"+data._attr+
            "/"+action);
  }
  
  return {
    contentType: {
      func: function(){
        return this.getHeader(/Content-Type/i);
      },
      deps: ["getHeader"]
    },
    hasContent: {
      func: function(){
        return this.contentLength > 0;
      },
      deps: ["contentLength"]
    },
    hasLargeContent: {
      func: function(){
        return this.contentLength > 1024 * 1024 * 0.5 /* > 0.5MB */;
      },
      deps: ["contentLength"]
    },
    viewUrl: {
      func: function(){
        return contentUrl(this,"inline");
      },
      deps: ["flow.id"]
    },
    downloadUrl: {
      func: function(){
        return contentUrl(this,"attachment");
      },
      deps: ["flow.id"]
    },
    getContent: {
      value: function(options) {
        var def = new Deferred();
        
        options = $.extend({
          responseType: "text",
          range: undefined,
          always: false,
        }, options);
        
        if(!this.hasContent){
          def.resolve("");
        }
        else if(!options.always && !options.range && this.contentLength > 1024 * 1024 * 1){
          if(!window.confirm("This request is pretty big and might cause performance issues ("+this.contentLengthFormatted+") if we load it. Press OK to continue anyway."))
          def.resolve("--- big chunk of data ---");
        } else {
          var xhr = new XMLHttpRequest();
              xhr.open('GET', this.viewUrl, true);
              xhr.responseType = options.responseType;
              
              if(options.range)
                xhr.setRequestHeader("Range",options.range);
              
              xhr.onload = function(e) {
                def.resolve(this.response,this);
              };
            
              xhr.send();
              
              def.then(undefined,function(){
                xhr.abort();
              });
        }
        return def;
      },
      deps: ["contentLength"]
    },
    contentLengthFormatted: {
      func: function(){
        return formatSize(this.contentLength);
      },
      deps: ["contentLength"]
    },
    getHeader: {
      func: function(){
        Object.defineProperty(this,"_headerLookups",{ value: {}, configurable: true});
        return function(regex){
          if(!(regex in this._headerLookups)) {
            var header;
            for(var i=0;i<this.headers.length;i++){
              if(!!this.headers[i][0].match(regex)){
                header = this.headers[i];
                break;
              }
            }
            this._headerLookups[regex] = header ? header[1] : undefined;
          }
          return this._headerLookups[regex];
        }
      },
      deps: ["headers"]
    },
    date_start: {
      func: function(){
        return new Date(this.timestamp_start * 1000);
      },
      deps: ["timestamp_start"]
    },
    rawHeader: {
      func: function(){
        //set request header
        var rawHeader = this.rawFirstLine;
        var headers = this.headers;
        for(var i=0;i<headers.length;i++){
          rawHeader += headers[i][0]+": "+headers[i][1]+"\n";
        }
        rawHeader += "\n"; //terminate with \n\n
        return rawHeader;
      },
      deps: ["rawFirstLine","headers"]
    }
  };
});