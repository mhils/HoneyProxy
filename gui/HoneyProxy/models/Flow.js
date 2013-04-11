define(["dojo/_base/declare","dojo/Stateful","./Request","./Response","../util/Observer","../util/safeMixin-es5"],function(declare, Stateful, requestDecorator, responseDecorator, Observer){
  var Flow = declare([Stateful],{
    constructor: function(json){
      declare.safeMixin(this, Observer.polyfillMixin);
      
      this.request = {};
      this.response = {};
      this.filters = new Stateful();
      declare.safeMixin(this, json);
      
      requestDecorator.decorate(this);
      responseDecorator.decorate(this);
    }
  });
  //FIXME: Remove debug
  window.requestDecorator  = requestDecorator;
  window.responseDecorator = responseDecorator;
  window.declare = declare;
  window.Flow = Flow;
  return Flow;
});