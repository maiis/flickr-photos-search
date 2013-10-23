$(function() {
	'use strict';

	var searchForm			= $('#searchForm'),
			searchField			= $('#searchField',searchForm),
			paginationNode	= $('#pagination'),
			imagesNode			= $('#images'),

			paginationOptions = { bootstrapMajorVersion: 3 },
			apiKey						= 'ee2183952a2224bdb5b92866091b8e49',
			perPage						= 10,
			activePage				= 1,
			defaultSearchText = 'valais+landscape',
			apiUrl						= 'http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+apiKey+'&per_page='+perPage+'&safe_search=1&format=json&nojsoncallback=1';

	function drawPagination(activePage,totalPages) {
		paginationOptions.currentPage = activePage;
		paginationOptions.totalPages = totalPages;

		if (totalPages >= 1) {
			paginationNode.show().bootstrapPaginator(paginationOptions);
		} else {
			paginationNode.hide();
		}
	}

	function doSearch(e,originalEvent,type,page) {
		if (e) {
			e.preventDefault();
		}

		var text = searchField.val().replace(/\s+/g, '+');
		if (text === '') {
			text = defaultSearchText;
		}

		if (!page) {
			page = activePage;
		}

		imagesNode.addClass('loading');

		$.getJSON(apiUrl + '&page=' + page + '&text='+ text, function(data){
			var src, link, imageNode, results = $();
			if (data.photos.total === ('0' || null)) {
				imagesNode.empty();
				imagesNode.append(
					'<div class="alert alert-warning">' +
						'<strong>Holy guacamole!</strong> There is no results for your research.' +
					'</div>'
				);
			} else {
				console.warn("data",data);
				$.each(data.photos.photo, function(i,item){
					src = 'http://farm'+ item.farm +'.static.flickr.com/'+ item.server +'/'+ item.id +'_'+ item.secret +'_q.jpg';
					link = 'http://www.flickr.com/photos/'+item.owner+'/'+item.id;
					imageNode = '<a href="'+link+'" target="_blank" title="'+item.title+'" class="thumbnail" style="background-image:url('+src+');"></a>';
					imagesNode.empty();
					results = results.add(imageNode);
				});
			}
			imagesNode.append(results);
			drawPagination(page,data.photos.pages);
		})
		.fail(function() {
			imagesNode.append(
				'<div class="alert alert-danger">' +
					'<strong>Oh snap! You got an error!</strong> Something went wrong.' +
				'</div>'
			);
			paginationNode.hide();
		})
		.always(function() {
			imagesNode.removeClass('loading');
		});
	}

	$(document)
		.on('submit',				searchForm,			doSearch)
		.on('page-clicked',	paginationNode, doSearch);

	doSearch(null,null,null,1);

});