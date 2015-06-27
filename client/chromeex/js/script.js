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
   			url: "http://localhost:8080/query",
   			data: 'query=' + $form.val() + '&user_id=2',
   			success: function(msg){
     			
   			}
 		});
		
		$('body').after($appendedHtml);
	});
	
	$('div.srg li.g div.rc h3.r a').click(function(e){
		var $this = $(this);
		
		var url = $this.attr('data-href');
		
		$.ajax({
   			type: "GET",
   			url: "https://localhost/url.php",
   			data: 'url=' + url,
   			success: function(msg){
     			alert(msg);
   			}
 		});
	});
});
