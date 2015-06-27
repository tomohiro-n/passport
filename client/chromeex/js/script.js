$(function(){
	var $form = $('#lst-ib');
	var $appendedHtml;	

	$.get(chrome.extension.getURL('oauth.html'), function(data){
		$appendedHtml = $(data);				
		
		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL('css/oauth.css');
		$appendedHtml.append($(style));
		
		var $p = $('<p/>')
		$p.html('検索キーワード:' + $form.val());
		
		$appendedHtml.append($p);
		
		$.ajax({
   			type: "GET",
   			url: "https://localhost/index.php",
   			data: '?query=' + $form.val(),
   			success: function(msg){
     			alert(msg);
   			}
 		});
		
		$('body').after($appendedHtml);
	});
	
	$('div.srg li.g div.rc h3.r a').click(function(e){
		var $this = $(this);
		
		var url = $this.attr('data-href'); 		
	});
});
