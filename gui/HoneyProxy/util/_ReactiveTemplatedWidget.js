/**
 * Reactive templating for Dojo
 */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/query",
    "dijit/_WidgetBase",
    "lodash",
    "./recursive-watch",
    "./Observer"
],function(declare, domConstruct, query, _WidgetBase, _, recursiveWatch, Observer){

  var default_bindings = {
    "replaceNode": function(type, node, value){
        if(!value)
          value = domConstruct.create("div");
        domConstruct.place(value,node,"only");
        node.dataset.suppressBind = true;
      }
  };
  
  var eventListenerBinding = function(type, node, func){
    node.addEventListener(type,func.bind(this));    
  };
  
  ["click","load"].forEach(function(event){
    default_bindings[event] = eventListenerBinding;
  });
  
  var _ReactiveTemplatedWidget = declare([_WidgetBase,Observer.polyfillMixin], {
    _bindings: default_bindings,
    context : {},
    constructor: function(){
      this.context.view = this;
      this.inherited(arguments);
    },
    get_binding: function(type){
      if(this.bindings && (type in this.bindings)){
        return this.bindings[type];
      } else if(type in this._bindings){
        return this._bindings[type];
      }
    },
    update_binding: function(type, node, value){
        // console.debug("update_binding", arguments);
        var binding = this.get_binding(type);
        if(binding){
          binding.apply(this,Array.prototype.slice.call(arguments));
        } else {
          node[type] = value;
        }
    },
    /**
     *  Compiles the Widget Template and converts it into a DOM Node.
     *  Returns the DOM Node.
     */
    _buildDom: function(){
      //Firstly, we search the (dojo-declare) prototype chain for a prototype holding a template.
      //We use the underscore templating micro engine (~ http://ejohn.org/blog/javascript-micro-templating/)

      var tmplObj = Object.getPrototypeOf(this).constructor;
      
      while(tmplObj && !tmplObj.template) {
        tmplObj = tmplObj.superclass.constructor;
      }
      if(!tmplObj)
        throw "No template specified.";
      
      //If the template hasn't been compiled yet, do so.
      if(!tmplObj._template) {
        console.debug("Compiling template...",tmplObj);
        tmplObj._template = _.template(tmplObj.template.trim());
      }
     
      var html = tmplObj._template(this);
      //convert template string into DOM
      var domNode = domConstruct.toDom(html);
            
      //If we have multiple nodes, toDom returns a  #document-fragment.
      //Wrap it in a <div>, if necessary.
      if(domNode.nodeType === 11){
        var _domNode = domConstruct.create("div");
        _domNode.appendChild(domNode);
        domNode = _domNode;
      }
      return domNode;
    },
    _eval: function(expr){
      /*jshint evil:true, withstmt:true*/
      with (this.context) {
        with (this.model) {
          return eval(expr);
        }
      }
    },
    _updateBinding: function(node,binding){
      var splitPosType  = binding.indexOf(":");
      var type          = binding.substr(0,splitPosType).trim();
      var property_expr = binding.substr(splitPosType+1).trim();

      property_expr = decodeURIComponent(property_expr); //decode encoded ";"s

      var value = this._eval(property_expr);

      this.update_binding(type, node, value);
    },
    buildRendering: function(){
      var self = this;

      this.domNode = this._buildDom();

      var nodes_to_bind = query("[data-bind]",this.domNode);
      if(this.domNode.dataset.bind) //query doesn't include the root node, check manually.
        nodes_to_bind.push(this.domNode);
      
      nodes_to_bind.forEach(function(node){

        var parentNode = node;
        while(parentNode !== self.domNode){
          parentNode = parentNode.parentNode;
          if(parentNode.dataset.suppressBind){
            return;
          }
        }

        var node_bindings = node.dataset.bind.split(";");
        node_bindings.forEach(self._updateBinding.bind(self,node));
      });

      this.inherited(arguments); 
    }
  });
  return _ReactiveTemplatedWidget;
});