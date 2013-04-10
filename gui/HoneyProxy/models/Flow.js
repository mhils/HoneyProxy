define(["dojo/_base/declare","dojo/Stateful","./Request","../util/safeMixin-es5"],function(declare, Stateful, requestDecorator){
  var Flow = declare([],{
    constructor: function(json){
      this.request = {};
      this.response = {};
      declare.safeMixin(this, json);
      requestDecorator.decorate(this.request);
      //declare.safeMixin(this.request, requestMixin)
      /*
      this.request = {};
      this.response = {};
      declare.safeMixin(this, json);
      declare.safeMixin(this.request, requestHelper);
      */
      /*this.data = json;
      this.request = Request(json.request);*/
      this.filters = new Stateful();
      //declare.safeMixin(this.data,json);
    }
  });
  window.Flow = Flow;
  return Flow;
});