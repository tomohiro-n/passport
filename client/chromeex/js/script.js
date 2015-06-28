OAuth.initialize('LpvB_HDMk5DoD1biSEDhrrDwD00');

$(function(){
	$('body').after('<div id="passport-container"></div>');
	$('#passport-container').on('click', '#passport-container_moreButton', function(){
		$('#passport-container').addClass('passport-container_collapse');
	});
});

var onQuery = function(){
	var $form = $('#lst-ib');
	var $appendedHtml;
	var twitteridKey = 'user_id';
	var queryObject;
	var nowUserIndex = 0;


	$.get(chrome.extension.getURL('oauth.html'), function(data){

		$('#passport-container').on('click', '#passport-container_changeUserButton', function(){
			if(queryObject.items[nowUserIndex + 1] == undefined){
				nowUserIndex = 0;
			} else {
				nowUserIndex ++;
			}
			appendContent();
		});

		function appendUser(){
			OAuth.popup('twitter', {cache: true}).then(function(result) {
				return result.get('/1.1/users/show.json?screen_name=' + queryObject.items[nowUserIndex].twitterid);
			}).then(function(data){
				var name = data.screen_name;
				var img = data.profile_image_url;
				var url = data.url || 'https://twitter.com/' + name;
				$('a#passport-container_twitterIcon').attr('href',url).html('<img src="' + img + '" alt="" />');
				$('.passport-container_twitterName').html('<a href="' + url + '" target="_blank">' + name + 'さん</a>');
			});
		}

		function appendOtherQueries(){
			if(queryObject.items[nowUserIndex].otherqueries == null){
				return;
			}
			$.get(chrome.extension.getURL('more.html'), function(data){
				$('.passport-container_moreBox').remove();
				var $moreHtml = $(data);
				var others = queryObject.items[nowUserIndex].otherqueries;
				for(var i= 0; i < others.length ; i++){
					$moreHtml.find('.passport-container_more').text('さらに' + others[i].query + 'で検索しました');
					$moreHtml.find('.passport-container_clickedHistoryName').html('<a href="' + others[i].url + '">' + others[i].title + '</a>');
					$('#passport-container').append($moreHtml.html());
				}
			});
		}

		function appendContent(){
			// zero
			if(queryObject.items == null){
				$('#passport-container').html('');
				return;
			}
			// first
			appendUser();

			$('.passport-container_clickedSite_name').html('<a href="' + queryObject.items[nowUserIndex].url + '">' + queryObject.items[nowUserIndex].title + '</a>');

			// other
			appendOtherQueries();

			if(queryObject.items.length == 1){
				return;
			}
		}

		function setContent(twitter_user_id){
			$.ajax({
				type: "POST",
				url: "//localhost:9444/query",
				data: JSON.stringify({'query': $form.val(), 'twitterid': twitter_user_id}),
				dataType: 'json',
				success: function(object){
					queryObject = object;

					appendContent();
				}
			});
		}

		$appendedHtml = $(data);

		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.type = 'text/css';
		style.href = chrome.extension.getURL('css/oauth.css');
		$appendedHtml.append($(style));

		$('#passport-container').html($appendedHtml.html()).removeClass('passport-container_collapse');

		$('#passport-container .passport-container_queryString')[0].innerHTML = $form.val() + 'を過去に検索したのは・・・'

		if(localStorage.getItem(twitteridKey)){
			setContent(localStorage.getItem(twitteridKey));
		} else {
			OAuth.popup('twitter', {cache: true}).then(function(result) {
				return result.get('/1.1/account/verify_credentials.json');
			}).then(function(data){
				setContent(data.screen_name);
				localStorage.setItem(twitteridKey, data.screen_name);
			});
		}

		$('#passport-container_changeUserButton img').attr('src', chrome.extension.getURL('icons/koushin.png'));
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
