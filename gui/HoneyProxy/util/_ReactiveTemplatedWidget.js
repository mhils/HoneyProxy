/**
 * Reactive templating for Dojo
 */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/query",
    "dijit/_WidgetBase",
    "dijit/registry",
    "./Observer"
], function(declare, domConstruct, on, query, _WidgetBase, registry, Observer) {

  var default_bindings = {
    "bind": function(type, node, value) {
      var obj = value[0];
      var prop = value[1];
      obj[prop] = node;
    }
  };

  var replaceNode = function(type, node, value) {
    if (!value)
      value = domConstruct.create("div");
    domConstruct.place(value, node, "only");
    node.dataset.suppressBind = true;
  };
  default_bindings.replaceNode = replaceNode;
  default_bindings.widget = function(type, node, value) {
    var widget;
    if (node.firstChild)
      widget = registry.byNode(node.firstChild);
    if (widget)
      widget.destroyRecursive(false);
    if (value) {
      this.own(value);
    }
    replaceNode(type, node, value ? value.domNode : undefined);
  };

  var hide = function(type, node, value) {
    if (value) {
      node.classList.add("hide");
    } else {
      node.classList.remove("hide");
    }
  };
  default_bindings.hide = hide;
  default_bindings.show = function(type, node, value) {
    hide(type, node, !value);
  };

  var eventListenerBinding = function(type, node, func) {
    this.own( on(node, type, func) );
  };

  ["click", "load", "change"].forEach(function(event) {
    default_bindings[event] = eventListenerBinding;
  });

  var _ReactiveTemplatedWidget = declare([_WidgetBase, Observer.ObservablePolyfillMixin], {
    _bindings: default_bindings,
    constructor: function() {
      this.context = this.context || {};
      this.updateBindings = this.updateBindings.bind(this);
      Observer.observe(this, function(records) {
        if (records.name === "model" || records.name === "context")
          this.updateBindings();
      });
    },
    getBinding: function(type) {
      if (this.bindings && (type in this.bindings)) {
        return this.bindings[type];
      } else if (type in this._bindings) {
        return this._bindings[type];
      }
    },
    updateBinding: function(type, node, value) {
      // console.debug("update_binding", arguments);
      var binding = this.getBinding(type);
      if (binding) {
        binding.apply(this, Array.prototype.slice.call(arguments));
      } else {
        node[type] = value;
      }
    },
    /**
     *  Compiles the Widget Template and converts it into a DOM Node.
     *  Returns the DOM Node.
     */
    _buildDom: function() {

      //convert template string into DOM
      var domNode = domConstruct.toDom(this.templateString);

      //If we have multiple nodes, toDom returns a  #document-fragment.
      //Wrap it in a <div>, if necessary.
      if (domNode.nodeType === 11) {
        var _domNode = domConstruct.create("div");
        _domNode.appendChild(domNode);
        domNode = _domNode;
      }
      return domNode;
    },
    _eval: function(expr) {
      /*jshint evil:true, withstmt:true*/
      with({
        view: this,
        model: this.model
      }) {
        with(this.context) {
          with(this.model || {}) {
            return eval(expr);
          }
        }
      }
    },
    _parseBinding: function(binding) {
      var splitPosType = binding.indexOf(":");
      var type = binding.substr(0, splitPosType).trim();
      var property_expr = binding.substr(splitPosType + 1).trim();

      property_expr = decodeURIComponent(property_expr); //decode encoded ";"s

      return [type, property_expr];
    },
    updateBindings: function() {
      var self = this;

      if (this.observedModel && this.model !== this.observedModel) {
        //console.log("unobserve old model");
        Observer.unobserve(this.observedModel, this.updateBindings);
      }
      if (this.model && this.model !== this.observedModel) {
        //console.log("observe new model");
        Observer.observe(this.model, this.updateBindings);
        this.observedModel = this.model;
      }
      if (this.requiresModel && !this.model) {
        return;
      }

      var handleBinding = function(node, binding) {
        var value = this._eval(binding[1]);
        this.updateBinding(binding[0], node, value);
      };

      this.node_bindings.forEach(function(binding_info) {
        var node = binding_info[0];
        var bindings = binding_info[1];
        bindings.forEach(handleBinding.bind(self, node));
      });
    },
    buildRendering: function() {
      var self = this;

      this.domNode = this._buildDom();
      this.node_bindings = [];

      var nodes_to_bind = query("[data-bind]", this.domNode);
      if (this.domNode.dataset.bind) //query doesn't include the root node, check manually.
        nodes_to_bind.push(this.domNode);

      nodes_to_bind.forEach(function(node) {

        var parentNode = node;
        while (parentNode !== self.domNode) {
          parentNode = parentNode.parentNode;
          if (parentNode.dataset.suppressBind) {
            return;
          }
        }

        var raw_bindings = node.dataset.bind.split(";");
        var bindings = raw_bindings.map(self._parseBinding.bind(self));
        self.node_bindings.push([node, bindings]);
      });

      this.updateBindings();

      this.inherited(arguments);
    },
    destroy: function() {
      if (this.observedModel) {
        Observer.unobserve(this.observedModel, this.updateBindings);
      }
      this.inherited(arguments);
    }
  });
  return _ReactiveTemplatedWidget;
});