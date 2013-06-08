/**
 * View class for a Flow or one of its subclasses.
 */
define(["lodash","../util/Observer","dojo/text!../templates/flow.ejs"],function(_,Observer,template){
  var flowTemplate = _.template(template);
  
  return Backbone.View.extend({
    tagName: "tr",
    render: function() {
      var self = this;
      
      if(this.model === undefined)
        return this;
      var html = flowTemplate(this.model);
      this.$el.html(html);

      this.$el.addClass(this.model.View.className);
      this.$el.data("flow-id",this.model.id);
      this.$el.addClass("request-scheme-"+this.model.request.scheme);
      for(var cls in this.model.filters){
        this.$el.addClass(cls);
      }
      
      this.$filterEl = this.$el.find(".filters");
      Observer.observe(this.model.filters,function(record){
        if(record.type === "new") {
          self.onFilterClassAdd(record.name);
        }else if(record.type === "deleted") {
          self.onFilterClassRemove(record.name);
        }
      });
      
      return this;
    },
    onFilterClassAdd: function(cls){
      var children = this.$filterEl.children();
      var inserted = false;
      for(var i=0;i<children.length && !inserted;i++) {
        var child = $(children[i]);
        if (child.attr("class") > cls) {
          child.before('<div class="'+cls+'"></div>');
          inserted = true;
        }
      }
      if(!inserted)
        this.$filterEl.append('<div class="'+cls+'"></div>');
      return this.$el.addClass(cls);
    },
    onFilterClassRemove: function(cls){
      this.$filterEl.find("."+cls.split(" ").join(".")).remove();
      return this.$el.removeClass(cls);
    }
  });
  
});