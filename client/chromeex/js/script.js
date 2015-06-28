OAuth.initialize('LpvB_HDMk5DoD1biSEDhrrDwD00');
$(function(){
	$('body').after('<div id="passport-container"></div>');
});
var onQuery = function(){
	var $form = $('#lst-ib');
	var $appendedHtml;
	var twitteridKey = 'user_id';

	$.get(chrome.extension.getURL('oauth.html'), function(data){

		function appendUser(twitter_user_id){
			$.ajax({
				type: "POST",
				url: "//localhost:9444/query",
				data: JSON.stringify({'query': $form.val(), 'twitterid': twitter_user_id}),
				dataType: 'json',
				success: function(object){
					// zero
					if(object.items == null){
						$('#passport-container').html('');
						return;
					}
					// first
					OAuth.popup('twitter', {cache: true}).then(function(result) {
						return result.get('/1.1/users/show.json?screen_name=' + object.items[0].twitterid);
					}).then(function(data){
						var name = data.screen_name;
						var img = data.profile_image_url;
						var url = data.url || 'https://twitter.com/' + name;
						$('a#passport-container_twitterIcon').attr('href',url).html('<img src="' + img + '" alt="" />');
						$('.passport-container_twitterName').text(name + 'さん');
					});

					$('.passport-container_clickedSite_name').html('<a href="' + object.items[0].url + '">' + object.items[0].title + '</a>');

					if(object.items.length == 1){
						return;
					}
					// other
					$.get(chrome.extension.getURL('more.html'), function(data){
						var $moreHtml = $(data);
						for(var i = 1; i < object.items.length; i++){
							$moreHtml.find('.passport-container_more').text('さらに' + i + 'で検索しました');
							$moreHtml.find('.passport-container_clickedHistoryName').html('<a href="' + i + '">' + i + '</a>');
							$('#passport-container').append($moreHtml.html());
						}
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

		$('#passport-container').html($appendedHtml.html());

		$('#passport-container .passport-container_queryString')[0].innerHTML = $form.val() + 'を過去に検索したのは・・・'

		if(localStorage.getItem(twitteridKey)){
			appendUser(localStorage.getItem(twitteridKey));
		} else {
			OAuth.popup('twitter', {cache: true}).then(function(result) {
				return result.get('/1.1/account/verify_credentials.json');
			}).then(function(data){
				appendUser(data.screen_name);
				localStorage.setItem(twitteridKey, data.screen_name);
			});
		}
	});

	$('div.rc h3.r a').click(function(e){
		var $this = $(this);

		var url = $this.attr('data-href');
		var title = $this.text();

		$.ajax({
				type: "POST",
				url: "//localhost:9444/dest",
				data: JSON.stringify({'query': $form.val(), 'twitterid': localStorage.getItem(twitteridKey), 'url': url, 'title': title}),
				dataType: 'json',
				success: function(){
				}
			});
	});
};

$(onQuery);

$("#lst-ib").change(onQuery);
