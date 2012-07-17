$(function(){
	$(document).on("click",".button-popout", function(){
		var content = $(this).siblings(".content");
		var html = HoneyProxy.template("popout",{
			"title":content.find(".title").text()+" - Detail View",
			"content":content.html()
			});
		var win = window.open("","popout","height=400,width=500");
		win.document.write(html);
		win.document.close();
	});
});

HoneyProxy.loadTemplate("popout");
	
	
