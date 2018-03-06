jQuery(document).ready(function() {
	getInfo();

	jQuery('#searchBox').on('click change keyup', function() {
		searchingBox();
		block();
	});
	$(window).resize(function(){block();});
	
});	
var Recycle = true;
var triggers = 0;

lightbox.option({
	'resizeDuration' : 200,
	'wrapAround' : true
})
jQuery(window).on("scroll", function() {
	var position = jQuery("body").scrollTop();
	var Whei = window.innerHeight;
	var adjust = Whei + position + 5;
	if (document.body.scrollHeight < adjust) {
		getInfo();
		searchingBox();
		Recycle = false;
	} else {
		Recycle = true;
	}
});
function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}
	return JSON.stringify(obj) === JSON.stringify({});
}

function jsonFlickrFeed(json) {
	console.log(json);
	triggers++;
	jQuery.each(json.items, function(i, item) {
		var Sclass = "." + item.author_id;
		var takeOutAuthorName = item.author;
		var name = takeOutAuthorName.slice(takeOutAuthorName.indexOf('("') + 2, takeOutAuthorName.indexOf('")'));
		jQuery('<div />').attr('id', 'single-picture-wrap' + i + "tr" + triggers).attr('class', item.author_id + " " + item.tags + " wrap-single").appendTo('#print');
		jQuery('<div />').attr('id', 'single-picture-wrap-in' + i + "tr" + triggers).attr('class', "wrap-single-inner").appendTo('#single-picture-wrap' + i + "tr" + triggers);
		jQuery('<a />').attr('target', '_blank').attr('id', 'single-picture-wrap' + i + "tr" + triggers + 'img-wrap').attr('data-lightbox', item.media.m).attr('href', item.media.m).attr('class', item.author_id + " " + item.tags + " img-wrap").appendTo('#single-picture-wrap-in' + i + "tr" + triggers);
		jQuery("<img />").attr('id', 'single-picture-wrap' + i + "tr" + triggers + 'img').attr("src", item.media.m).attr('title', item.title).appendTo('#single-picture-wrap' + i + "tr" + triggers + 'img-wrap');
		jQuery('<div class="poster"><a target="_blank" href="' + item.link + '">' + item.title + '</a> by <a target="_blank" class="author-name" href="https://www.flickr.com/people/' + item.author_id + '">' + name + '</a></div>').appendTo('#single-picture-wrap-in' + i + "tr" + triggers);
		jQuery('<div class="item-description"><span>Description: </span>' + item.description + "</div>").appendTo('#single-picture-wrap-in' + i + "tr" + triggers);
		if (jQuery.isEmptyObject(item.tags) != true) {
			jQuery('<div class="item-tags"><span>Tags: </span>' + item.tags + '</div>').appendTo('#single-picture-wrap-in' + i + "tr" + triggers);
		} else {
			jQuery('<div class="item-tags"></div>').appendTo('#single-picture-wrap-in' + i + "tr" + triggers);
		}

	});
	searchingBox();
	block();
};
function block() {
	if ( window.innerWidth > 768) {
		jQuery('#print').BlocksIt({
			numOfCol : 4,
			offsetX : 0,
			offsetY : 0,
			blockElement : '.wrap-single'
		});
	} else {
		jQuery('#print').BlocksIt({
			numOfCol : 2,
			offsetX : 0,
			offsetY : 0,
			blockElement : '.wrap-single'
		});
	}
}

function getInfo() {
	if (Recycle === true) {
		jQuery.ajax({
			url : 'https://api.flickr.com/services/feeds/photos_public.gne',
			dataType : 'jsonp',
			data : {
				"format" : "json"
			}
		});
		Recycle = false;
	}
}

function searchingBox() {
	// Declare variables
	var input,
	    filter,
	    wrapper,
	    title,
	    i,
	    select,
	    box;
	select = jQuery('#search-option').val();
	input = jQuery('#searchBox');
	filter = input[0].value.toLowerCase();
	wrapper = jQuery('#container .wrap-single');
	// Loop through all list items, and hide those who don't match the search query
	for ( i = 0; i < wrapper.length; i++) {
		if (select == "description") {
			title = wrapper[i].getElementsByClassName('item-description');
		} else if (select == "tags") {
			title = wrapper[i].getElementsByClassName('item-tags');
		} else if (select == "author") {
			title = wrapper[i].getElementsByClassName('author-name');
		}
		//title = title.getElementsByTagName('div')[0];
		if (title[0].innerHTML.toLowerCase().indexOf(filter) > -1) {
			wrapper[i].classList.remove("invisible");
			wrapper[i].classList.add("visible");
		} else {
			wrapper[i].classList.add("invisible");
			wrapper[i].classList.remove("visible");
		}

	}
}
