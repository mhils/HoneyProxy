$(function(){
	
	var template = _.template($("#template-popout").html());
	
	$(document).on("click",".popoutbutton", function(){
		var content = $(this).siblings(".content");
		var html = template({
			"title":content.find(".title").text()+" - Detail View",
			"content":content.html()
			});
		var win = window.open("","popout","height=400,width=500");
		win.document.write(html);
		win.document.close();
	});
});