OAuth.initialize('LpvB_HDMk5DoD1biSEDhrrDwD00')
var onQuery = function(){
	var $form = $('#lst-ib');
	var $appendedHtml;	
	var twitteridKey = 'user_id';

	$.get(chrome.extension.getURL('oauth.html'), function(data){
		function appendUser(object){						
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

		$appendedHtml = $(data);

		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL('css/oauth.css');
		$appendedHtml.append($(style));		

		$('body').after($appendedHtml);
		
		$('#passport-container .passport-container_queryString')[0].innerHTML = $form.val() + 'を最後に検索したのは・・・'

		OAuth.popup('twitter', {cache: true}).then(function(result) {
			return result.get('/1.1/account/verify_credentials.json');
		}).then(function(data){			
			var twitterid = data.id_str;
			localStorage.setItem(twitteridKey ,twitterid);
			
			$.ajax({
				type: "POST",
				url: "//localhost:9444/query",
				data: JSON.stringify({'query': $form.val(), 'twitterid': twitterid}),
				dataType: 'json',
				success: appendUser
			});
		});
	});

	$('div.rc h3.r a').click(function(e){		
		var $this = $(this);

		var url = $this.attr('data-href');		
		
		$.ajax({
				type: "POST",
				url: "//localhost:9444/dest",
				data: JSON.stringify({'query': $form.val(), 'twitterid': localStorage.getItem(twitteridKey), 'url': url}),
				dataType: 'json',
				success: function(){
					
				}
			});
	});
};

$(onQuery);

$("#lst-ib").change(onQuery);
