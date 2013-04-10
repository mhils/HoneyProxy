/**
 * Contains shared methods of Request and Response objects. Stateless.
 */
define(["lodash","dojo/Deferred","dojo/request","../util/formatSize"],function(_,Deferred,request,formatSize){
  
  var sharedFlowProperties = {
    get httpversion() {
      return this.data.httpversion || [1,0] /* stay compatible with mitmproxy 0.8 */;
    },
    get data() {
      return this._flow.data[this._attr];
    },
    get cache() {
      return this.data;
    },
    get msg() {
      return this.data.msg;
    },
    get contentLength() {
      return this.data.contentLength;
    },
    get contentType(){
      return this.getHeader(/Content-Type/i);
    },
    get contentChecksums() {
      return this.data.contentChecksums;
    },
    get hasContent() {
      return this.contentLength > 0;
    },
    get hasLargeContent() {
        return this.contentLength > 1024 * 1024 * 0.5 /* > 0.5MB */;
    },
    getContentURL: function(action){
      var url = 
        "/files"+
        "/"+this._flow.id+
        "/"+this._attr+
        "/"+action;
      return url;
    },
    get viewUrl() {
      return this.getContentURL("inline");
    },
    get downloadUrl() {
      return this.getContentURL("attachment");
    },
    getContent: function(options) {
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
      }
      return def;
    },
    get contentLengthFormatted() {
      if(!this.cache.contentLengthFormatted)
      {
        this.cache.contentLengthFormatted = formatSize(this.contentLength);
      }
      return this.cache.contentLengthFormatted;
    },
    getHeader: function(regex){
      if(!this.cache.headerLookups)
        this.cache.headerLookups = {};
      if(!(regex in this.cache.headerLookups)) {
        var header = _.find(this.headers, function(header){
          return !!header[0].match(regex);
        });
        this.cache.headerLookups[regex] = header ? header[1] : undefined;
      }
      return this.cache.headerLookups[regex];
    },
    get headers() {
      return this.data.headers;
    },
    get timestamp_start() {
      return this.data.timestamp_start;
    },
    get timestamp_end() {
      return this.data.timestamp_end;
    },
    //TODO: Add date_end
    get date_start() {
      if(!this.cache.date_start) {
        this.cache.date_start = new Date(this.timestamp_start * 1000);
      }
      return this.cache.date_start;
    },
    get rawHeader() {
      if(!this.cache.rawHeader){
        //set request header
        var rawHeader = this.rawFirstLine;
        var headers = this.headers;
        for(var i=0;i<headers.length;i++){
          rawHeader += headers[i][0]+": "+headers[i][1]+"\n";
        }
        rawHeader += "\n"; //terminate with \n\n
        this.cache.rawHeader = rawHeader;
      }
      return this.cache.rawHeader;
    }
  };
  return sharedFlowProperties;
});