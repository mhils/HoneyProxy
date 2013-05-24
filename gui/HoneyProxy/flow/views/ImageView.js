/**
 * Flow subclass responsible for proper display of image files. Basically
 * loading file content as an image and subscribing to .load() events to display filesize etc.
 */
define([ "dojo/_base/declare","./AbstractView", 
         "dojo/text!./templates/ImageView.ejs"], 
         function(declare, AbstractView, template) {
   
  var ImageView = declare([AbstractView], {
   onImageLoad: function(e){
      this.imageWidth  = e.target.naturalWidth;
      this.imageHeight =  e.target.naturalHeight;
      this.refresh();
    }
  });
  
  ImageView.className = "flow-image";
  ImageView.template = template;
  ImageView.matches = ImageView.simpleMatcher(/image/i, /\.(gif|png|jpg|jpeg)$/i);

  return ImageView;
});