/**
 * Provide popout functionality - this class is responsible for the popout
 * feature of the detail view.
 */
define([ "require", "dojo/text!./templates/popout.ejs"],
	function(require, tmpl) {
		
		var template = _.template(tmpl);
		
		require(["dojo/domReady!"], function() {
			$(document).on("click", ".button-popout", function() {
				var content = $(this).siblings(".content");
				var html = template({
					"title": content.find(".title").text() + " - Detail View",
					"content": content.html()
				});
				var win = window.open("", "popout", "height=400,width=500");
				win.document.write(html);
				win.document.close();
			});
		});
		
		return true;
	});
