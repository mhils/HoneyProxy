/**
 * Proxy object for better access to Flows. Be aware that both Request and
 * Response objects are stateless!
 */
 
define(["dojo/_base/declare","dojo/Deferred","../utilities","./sharedFlowPropertiesMixin","../util/recursive-watch","../util/safeMixin-es5"],
function(declare,Deferred,utilities,sharedFlowPropertiesMixin, recursiveWatch){
  "use strict";
  
  var computed = recursiveWatch.computed;
  
  var Decorator = declare([],{
    constructor: function(){
      this.properties = {}
    },
    addProperties: function(){
      var self = this;
      Array.prototype.forEach.call(arguments, function(prop){
        self.addProperty.apply(self,prop);
      });
    },
    addProperty: function(name, func){
      var deps = Array.prototype.slice.call(arguments,2);
      this.properties[name] = func;
      func.dependencies = deps.map(function(dep){ return dep.split(".") });
    },
    decorate: function(obj){
      for(var property_name in this.properties){
        var property_func = this.properties[property_name];
        var update = function(){
          Object.defineProperty(obj,property_name,{
            value: property_func.call(obj),
            //writable: false (default),
            //enumerable: false (default),
            configurable: true
          });
        }
        property_func.dependencies.forEach(function(dep){
          recursiveWatch(obj,dep,update);
        });
        
        update();
      }
    }
  });
  
  var requestDecorator = new Decorator();
  
  requestDecorator.addProperty("hostFormatted", function(){
    return this.hostFormatted ? this.hostFormatted : (this.host+"foo");
  },"host","hostFormatted");
  
  return requestDecorator;
    /*
  
  var Request = function(flow){
    this._flow = flow;
  };
  var Request = declare([sharedFlowPropertiesMixin],{
    constructor: function(flow){
      this._flow = flow;
      /*var computed= watch.computed.bind(this);
      this.path = computed("data.path");
      this.host = computed("data.host");
      this.hostFormatted = computed(function(){
        return "hostFormatted" in this.data ? this.data.hostFormatted : this.data.host;
      }, "data.hostFormatted", "data.host");
      this.port = computed("data.port");
      this.method = computed("data.method");
      this.scheme = computed("data.scheme");
      this.client_conn = computed("data.client_conn");*//*
    },
    attr: "request",
    path: computed(function(){
      return flow.data.path;
    },["data.path"]),
    data: computed(function(){
      return this._flow.data[this._attr];
      return flow.request.data;
    },["_flow"])
    
    path: simple(this,"data.path");
  });
  
  var defaultPorts = {"http":80,"https":443};
  
  Request.prototype = {
    get _attr() {
      return "request";
    },
    get path() {
      return this.data.path;
    },
    get host() {
      return this.data.host;
    },
    get hostFormatted() {
      return "hostFormatted" in this.data ? this.data.hostFormatted : this.host;
    },
    get port() {
      return this.data.port;
    },
    get method() {
      return this.data.method; 
    },
    get scheme() {
      return this.data.scheme;
    },
    get client_conn() {
      return this.data.client_conn;
    },
    get hasFormData() {
      if(!this.hasContent)
        return false;
      return this.contentType && !!this.contentType.match(/^application\/x-www-form-urlencoded\s*(;.*)?$/i);
    },
    get hasPayload() {
      return this.hasContent && (!this.hasFormData);
    },
    getFormData: function(){
      if(this.cache.formDataParsed)
        return (new Deferred())
          .resolve(this.cache.formDataParsed);
      else {
        var self = this;
        var deferred = new Deferred();
        this.getContent().then(function(data){
          var formData = utilities.parseParameters(data);
          this.cache.formDataParsed = formData;
          deferred.resolve(formData);
        });
        return deferred;
      }
    },
    _processName: function(){
      var params = this.path.split("?");
      var path = params.shift().split("/");
      params.unshift("");
      var fullpath = this.scheme + "://" + this.hostFormatted;
      if(!(this.scheme in defaultPorts) || defaultPorts[this.scheme] !== this.port)
        fullpath += ":" + this.port;
      fullpath += path.join("/");
      var filename = path.pop();
      this.cache.filename = filename === "" ? "/" : filename;
      this.cache.queryString = params.join("?");
      this.cache.fullPath = fullpath;
    },
    get filename() {
      if(!this.cache.filename)
        this._processName();
      return this.cache.filename;
    },
    get queryString(){
      if(!this.cache.queryString)
        this._processName();
      return this.cache.queryString;
    },
    get fullPath() {
      if(!this.cache.fullPath)
        this._processName();
      return this.cache.fullPath;
    },
    get rawFirstLine() {
      return [this.method,this.path,"HTTP/" + this.httpversion.join(".")]
          .join(" ")+"\n";
    }
  };
  // depends on https://github.com/documentcloud/underscore/pull/694
  declare.safeMixin(Request.prototype,sharedFlowProperties);

  return Request;*/
});