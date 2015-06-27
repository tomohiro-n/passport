OAuth.initialize('LpvB_HDMk5DoD1biSEDhrrDwD00')
var onQuery = function(){
	var $form = $('#lst-ib');
	var $appendedHtml;

	$.get(chrome.extension.getURL('oauth.html'), function(data){

		function appendUser(twitterid){
			$.ajax({
				type: "POST",
				url: "//localhost:9444/query",
				data: JSON.stringify({'query': $form.val(), 'twitterid': twitterid}),
				dataType: 'json',
				success: function(object){
					OAuth.popup('twitter', {cache: true}).then(function(result) {
						return result.get('/1.1/users/show.json?id=' + object.items[0].twitterid);
					}).then(function(data){
						var name = data.screen_name;
						var img = data.profile_image_url;
						var url = data.url;
						$('a#passport-container_twitterIcon').attr('href',url).html('<img src="' + img + '" alt="" />');
						$('.passport-container_twitterName').text(name + 'さん');
					});
				}
			});
		}

		$appendedHtml = $(data);

		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL('css/oauth.css');
		$appendedHtml.append($(style));

		var $p = $('<p/>')
		$p.html('検索キーワード:' + $form.val());

		$appendedHtml.append($p);

		$('body').after($appendedHtml);

		var twitterid = localStorage.getItem('twitterid');
		if(twitterid){
			appendUser(twitterid);
		} else {
			OAuth.popup('twitter', {cache: true}).then(function(result) {
				return result.get('/1.1/account/verify_credentials.json');
			}).then(function(data){
				twitterid = data.id_str;
				appendUser(twitterid);
				localStorage.setItem('twitterid', twitterid);
			});
		}
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
};

$(onQuery);

$("#lst-ib").change(onQuery);
