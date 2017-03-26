'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var spillApp = {};
spillApp.lcboKey = 'MDpkODE2NzI1ZS1mZGM4LTExZTYtODdlZi03MzlkMjFiYjEwYzg6TEw1Z0hoTjI2Vk1LNkZhZnVsV0FIM2JhbmFqazlSQ005ZXpO';
spillApp.movieKey = '19852fdee6db33ca0f22110c94252b3b';
spillApp.posterURL = 'https://image.tmdb.org/t/p/w300/';

spillApp.movieDBSearch = function (queryParam) {
	spillApp.userSearchMovie = $.ajax({
		url: 'https://api.themoviedb.org/3/search/multi',
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: spillApp.movieKey,
			include_adult: false,
			with_original_language: 'en',
			query: queryParam
		}
	});
	$.when(spillApp.userSearchMovie).done(function (dataFromMovie) {
		var returnedUserData = dataFromMovie.results;
		var filteredForPopularity = returnedUserData.filter(function (item) {
			return item.popularity > 1.4;
		});
		var filteredUserData = filteredForPopularity.filter(function (item) {
			return item.original_language !== 'cn' && item.original_language !== 'ko';
		});
		spillApp.showMediaToChoose(filteredUserData);
	});
}; //end of movieDBSearch();

spillApp.finalChoiceMovieSearch = function (id) {
	spillApp.finalUserSearch = $.ajax({
		url: 'https://api.themoviedb.org/3/movie/' + id,
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: spillApp.movieKey
		}
	});
	$.when(spillApp.finalUserSearch).done(function (data) {
		// console.log(data);
		spillApp.getComparativeMedia(data);
	});
}; //end of finalChoiceMovieSearch();

spillApp.finalChoiceTVSearch = function (id) {
	spillApp.finalUserTVSearch = $.ajax({
		url: 'https://api.themoviedb.org/3/tv/' + id,
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: spillApp.movieKey
		}
	});
	$.when(spillApp.finalUserTVSearch).done(function (data) {
		// console.log(data);
		spillApp.getComparativeMedia(data);
	});
}; //end of finalChoiceTVSearch()

spillApp.discoverMedia = function (queryParam) {
	spillApp.userdiscoverMedia = $.ajax({
		url: 'https://api.themoviedb.org/3/discover/' + queryParam,
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: spillApp.movieKey,
			include_adult: false,
			with_original_language: 'en',
			page: 1
		}
	});
	$.when(spillApp.userdiscoverMedia).done(function (discoverData) {
		spillApp.discoverMediaTwo(queryParam, discoverData);
	});
}; //end of discoverMedia();

spillApp.discoverMediaTwo = function (queryParam, firstArray) {
	spillApp.userdiscoverMediaTwo = $.ajax({
		url: 'https://api.themoviedb.org/3/discover/' + queryParam,
		method: 'GET',
		dataType: 'json',
		data: {
			api_key: spillApp.movieKey,
			include_adult: false,
			with_original_language: 'en',
			page: 3
		}
	});
	$.when(spillApp.userdiscoverMediaTwo).done(function (discoverdataTwo) {

		var firstArrayResults = firstArray.results;
		var secondArrayResults = discoverdataTwo.results;
		spillApp.finalMediaArray = [].concat(_toConsumableArray(firstArrayResults), _toConsumableArray(secondArrayResults));
		spillApp.displayMedia(spillApp.finalMediaArray);
	});
}; //end of discoverMediaTwo()

spillApp.searchlcboDB = function (param) {
	spillApp.getBooze = $.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			q: param,
			access_key: spillApp.lcboKey,
			per_page: 100,
			page: 1
		}
	});
	$.when(spillApp.getBooze).done(function (boozeData) {
		var firstArrayReturn = boozeData.result;
		spillApp.searchlcboDBTwo(param, firstArrayReturn);
	});
}; //end of searchlcboDB();

spillApp.searchlcboDBTwo = function (param, firstArrayReturn) {
	spillApp.getBoozeTwo = $.ajax({
		url: 'https://lcboapi.com/products',
		method: 'GET',
		dataType: 'json',
		data: {
			q: param,
			access_key: spillApp.lcboKey,
			per_page: 100,
			page: 3
		}
	});
	$.when(spillApp.getBoozeTwo).done(function (boozeDataTwo) {
		var secondArrayReturn = boozeDataTwo.result;
		var finalBoozeArray = [].concat(_toConsumableArray(firstArrayReturn), _toConsumableArray(secondArrayReturn));
		var finalBoozeArrayImage = finalBoozeArray.filter(function (item) {
			return item.image_url !== null;
		});
		spillApp.filterBoozeData(finalBoozeArrayImage);
	});
};

spillApp.showMediaToChoose = function (array) {
	$('.manyOptions').empty();
	$('.headerText').empty();
	var isTv = function isTv(media) {
		return media.media_type === 'tv';
	};
	var isMovie = function isMovie(media) {
		return media.media_type === 'movie';
	};
	var tvFilter = array.filter(isTv);
	var movieFilter = array.filter(isMovie);
	var movieTitle = 'title';
	var tvTitle = 'name';
	if (array.length > 1) {
		var headerText = '<h4>Confirm your media selection</h4>';
		$('.headerText').append(headerText);
		tvFilter.forEach(function (item) {
			console.log(item.poster_path);
			var noImage = '<img src="../images/noImage.jpg" alt="no movie poster available">';
			var image = '';
			if (item.poster_path != null) {
				image = '<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '">';
				console.log('image exsists');
			} else {
				image = noImage;
				console.log('no image');
			}
			var listItem = '<input \n\t\t\t\t\t\t\t\ttype=radio \n\t\t\t\t\t\t\t\tid=' + item.id + ' \n\t\t\t\t\t\t\t\tvalue="' + item[tvTitle] + '" \n\t\t\t\t\t\t\t\tchecked=true \n\t\t\t\t\t\t\t\tname="finalOptions" \n\t\t\t\t\t\t\t\tdata-media="tv" \n\t\t\t\t\t\t\t\tdata-id=' + item.id + '>\n\t\t\t\t\t\t\t<div class=\'resultItem\'>\n\t\t\t\t\t\t\t\t<label for=' + item.id + '>\n\t\t\t\t\t\t\t\t\t<div class="imageContain">\n\t\t\t\t\t\t\t\t\t\t' + image + '\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<h5>' + item[tvTitle] + '</h5>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>';
			var elemString = $('<li>').addClass('resultItemContain').html(listItem);
			$('.manyOptions').append(elemString);
			$('.boozeFormPartTwo').show();
		});

		movieFilter.forEach(function (item) {
			var noImage = '<img src="../images/noImage.jpg" alt="no movie poster available">';
			var image = '';
			if (item.poster_path != null) {
				image = '<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '">';
				console.log('image exsists');
			} else {
				image = noImage;
				console.log('no image');
			}
			var listItem = '<input \n\t\t\t\t\t\t\t\t\ttype=radio \n\t\t\t\t\t\t\t\t\tid=' + item.id + ' \n\t\t\t\t\t\t\t\t\tvalue="' + item[movieTitle] + '" \n\t\t\t\t\t\t\t\t\tchecked=true \n\t\t\t\t\t\t\t\t\tname="finalOptions" \n\t\t\t\t\t\t\t\t\tdata-media="movie" \n\t\t\t\t\t\t\t\t\tdata-id=' + item.id + '>\n\t\t\t\t\t\t\t<div class=\'resultItem\'>\n\t\t\t\t\t\t\t\t<label for=' + item.id + '>\n\t\t\t\t\t\t\t\t\t<div class="imageContain">\n\t\t\t\t\t\t\t\t\t\t' + image + '\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<h5>' + item[movieTitle] + '</h5>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>';
			var elemString = $('<li>').addClass('resultItemContain').html(listItem);
			$('.manyOptions').append(elemString);
			$('.boozeFormPartTwo').show();
			$('.chooseTheBooze').show();
		});
	} else if (array.length === 1) {
		var _headerText = '<h4>Was this what you were looking for?</h4>';
		$('.headerText').append(_headerText);
		tvFilter.forEach(function (item) {
			var noImage = '<img src="../images/noImage.jpg" alt="no movie poster available">';
			var image = '';
			if (item.poster_path != null) {
				image = '<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '">';
				console.log('image exsists');
			} else {
				image = noImage;
				console.log('no image');
			}
			var listItem = '\n\t\t\t\t\t\t\t\t<input \n\t\t\t\t\t\t\t\t\t\ttype=radio \n\t\t\t\t\t\t\t\t\t\tid=' + item.id + ' \n\t\t\t\t\t\t\t\t\t\tvalue="' + item[tvTitle] + '" \n\t\t\t\t\t\t\t\t\t\tchecked=true \n\t\t\t\t\t\t\t\t\t\tname="finalOptions" \n\t\t\t\t\t\t\t\t\t\tdata-media="tv" \n\t\t\t\t\t\t\t\t\t\tdata-id=' + item.id + '>\n\t\t\t\t\t\t\t<div class=\'resultItem\'>\n\t\t\t\t\t\t\t\t<label for=' + item.id + '>\n\t\t\t\t\t\t\t\t\t<div class="imageContain">\n\t\t\t\t\t\t\t\t\t\t' + image + '\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<h5>' + item[tvTitle] + '</h5>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>';
			var elemString = $('<li>').addClass('resultItemContain').html(listItem);
			// let elemString = image + listItem;
			$('.manyOptions').append(elemString);
			$('.boozeFormPartTwo').show();
			$('.chooseTheBooze').show();
		});
		movieFilter.forEach(function (item) {
			var noImage = '<img src="../images/noImage.jpg" alt="no movie poster available">';
			var image = '';
			if (item.poster_path != null) {
				image = '<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '">';
				console.log('image exsists');
			} else {
				image = noImage;
				console.log('no image');
			}
			var listItem = '\n\t\t\t\t\t\t\t\t<input \n\t\t\t\t\t\t\t\t\t\ttype=radio \n\t\t\t\t\t\t\t\t\t\tid=' + item.id + ' \n\t\t\t\t\t\t\t\t\t\tvalue="' + item[movieTitle] + '" \n\t\t\t\t\t\t\t\t\t\tchecked=true \n\t\t\t\t\t\t\t\t\t\tname="finalOptions" \n\t\t\t\t\t\t\t\t\t\tdata-media="movie" \n\t\t\t\t\t\t\t\t\t\tdata-id=' + item.id + '>\n\t\t\t\t\t\t\t<div class=\'resultItem\'>\n\t\t\t\t\t\t\t\t<label for=' + item.id + '>\n\t\t\t\t\t\t\t\t\t<div class="imageContain">\n\t\t\t\t\t\t\t\t\t\t' + image + '\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<h5>' + item[movieTitle] + '</h5>\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</div>';
			var elemString = $('<li>').addClass('resultItemContain').html(listItem);
			$('.manyOptions').append(elemString);
			$('.boozeFormPartTwo').show();
			$('.chooseTheBooze').show();
		});
	} else if (array.length < 1) {
		var elemString = '<li class="nothing">Nothing here, please search again!</li>';
		$('.manyOptions').append(elemString);
		$('.boozeFormPartTwo').show();
		$('.chooseTheBooze').hide();
	}
};

spillApp.gsapInit = function () {
	var barOne = $('.animateOne');
	var barTwo = $('.animateTwo');
	var barThree = $('.animateThree');
	var barFour = $('.animateFour');
	var barFive = $('.animateFive');
	var barSix = $('.animateSix');
	var barSeven = $('.animateSeven');
	spillApp.timeline = new TimelineMax({ paused: true, onComplete: function onComplete() {
			this.restart();
		} });
	spillApp.timeline.to(barOne, 0.5, { backgroundColor: 'purple', ease: Power1.easeIn }, 0).to(barFour, 0.5, { backgroundColor: 'cyan', ease: Power1.easeIn }, 0).to(barTwo, 0.5, { backgroundColor: 'green', ease: Power1.easeIn }, 0.5).to(barFive, 0.5, { backgroundColor: 'blue', ease: Power1.easeIn }, 0.5).to(barFour, 0.5, { backgroundColor: 'yellow', ease: Power1.easeIn }, 1).to(barSeven, 0.5, { backgroundColor: 'pink', ease: Power1.easeIn }, 1).to(barSix, 0.5, { backgroundColor: 'red', ease: Power1.easeIn }, 1.5);
	// .to(barFive, 0.5, {backgroundColor: 'red'}, 2)
};
//ANIMATION
spillApp.animation = function () {
	console.log('animation running');
	$('.chooseFirstOption').hide();
	spillApp.timeline.play();
	$('.animatedSquare').addClass('animatedSquareShow');

	// const animatedItem = $('.animatedSquare');
	// var tween = TweenLite.to(animatedItem, 5, {x:300px});	
};

spillApp.stopAnimation = function () {
	$('.animatedSquare').removeClass('animatedSquareShow');
	spillApp.timeline.stop();
	console.log('animation OVER');
};

spillApp.submitGetBooze = function () {
	$('#getBoozeSubmit').on('click', function (e) {
		e.preventDefault();
		spillApp.animation();
		spillApp.userBoozeChoice = $('input[name=boozeType]:checked').val();
		var mediaType = $('input[name=finalOptions]:checked').data('media');
		var userFinalMediaChoice = $('input[name=finalOptions]:checked').data('id');
		// console.log(userFinalMediaChoice);
		// console.log(mediaType);
		if (mediaType === 'tv') {
			spillApp.finalChoiceTVSearch(userFinalMediaChoice);
		} else if (mediaType === 'movie') {
			spillApp.finalChoiceMovieSearch(userFinalMediaChoice);
		}
		spillApp.searchlcboDB(spillApp.userBoozeChoice);
	});
}; //end of submitGetBooze()

//This Sequence filters the user's movie search and compares to user's booze wants. This is for option "What am I watching?"
spillApp.filterBoozeData = function (array) {
	var typeOfBooze = array[0].primary_category;
	var typeOfWine = array[0].secondary_category;
	var alcContentSorted = _.sortBy(array, 'alcohol_content');

	spillApp.sortLowPop = function () {
		var sortedResult = _.sortBy(array, 'alcohol_content');
		var shortenedResults = _.last(sortedResult, 10);
		return shortenedResults;
	};
	spillApp.sortMedPop = function () {
		var sortedResult = _.sortBy(array, 'alcohol_content');
		var cutResults = _.rest(sortedResult, 10);
		var shortenedResults = _.shuffle(cutResults).slice(0, 10);
		return shortenedResults;
	};
	spillApp.sortHighPop = function () {
		var sortedResult = _.sortBy(array, 'alcohol_content');
		var cutResults = _.initial(sortedResult, 20);
		var shortenedResults = _.shuffle(cutResults).slice(0, 10);
		return shortenedResults;
	};
	if (typeOfBooze === 'Beer') {
		if (spillApp.mediaPopularity < 4) {
			spillApp.tenResults = spillApp.sortLowPop();
		} else if (spillApp.mediaPopularity > 4.1 && spillApp.mediaPopularity < 6.5) {
			spillApp.tenResults = spillApp.sortMedPop();
		} else if (spillApp.mediaPopularity >= 6.5) {
			spillApp.tenResults = spillApp.sortHighPop();
		}
	} else if (typeOfBooze === 'Ciders') {
		if (spillApp.mediaPopularity < 4) {
			spillApp.tenResults = spillApp.sortLowPop();
		} else if (spillApp.mediaPopularity > 4.1 && spillApp.mediaPopularity < 6.5) {
			spillApp.tenResults = spillApp.sortMedPop();
		} else if (spillApp.mediaPopularity >= 6.5) {
			spillApp.tenResults = spillApp.sortHighPop();
		}
	} else if (typeOfWine === 'White Wine') {
		if (spillApp.mediaPopularity < 4) {
			spillApp.tenResults = spillApp.sortLowPop();
		} else if (spillApp.mediaPopularity > 4.1 && spillApp.mediaPopularity < 6.5) {
			spillApp.tenResults = spillApp.sortMedPop();
		} else if (spillApp.mediaPopularity >= 6.5) {
			spillApp.tenResults = spillApp.sortHighPop();
		}
	} else if (typeOfWine === 'Red Wine') {
		if (spillApp.mediaPopularity < 4) {
			spillApp.tenResults = spillApp.sortLowPop();
		} else if (spillApp.mediaPopularity > 4.1 && spillApp.mediaPopularity < 6.5) {
			spillApp.tenResults = spillApp.sortMedPop();
		} else if (spillApp.mediaPopularity >= 6.5) {
			spillApp.tenResults = spillApp.sortHighPop();
		}
	}
	spillApp.displayResults(spillApp.tenResults);
};

spillApp.getComparativeMedia = function (array) {
	var mediaPopularity = array.vote_average;
	spillApp.mediaPopularity = mediaPopularity;
	spillApp.displayComparitiveMedia(array);
};

spillApp.displayComparitiveMedia = function (result) {
	console.log(result);
	if (result.poster_path !== null) {
		var mediaPoster = result.poster_path;
	} else {
		var mediaPoster = result.title;
	};
	var rating = result.vote_average;
	var ratingMessage;
	var stars = '';
	if (rating < 4) {
		ratingMessage = 'Maybe pick a couple options...';
		stars = '<span class="starRating"><i class="fa fa-star" aria-hidden="true"></i></span>';
	} else if (rating > 4.1 && rating < 7.1) {
		ratingMessage = 'Looks good!';
		stars = '<span class="starRating"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></span>';
	} else if (rating >= 7.1) {
		ratingMessage = 'Good stuff!';
		stars = '<span class="starRating"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></span>';
	}
	var userMessage = '<div class="userMedia__header">\n\t\t\t\t\t\t\t<h2>We\'ve found some pairings for your choice!</h2>\n\t\t\t\t\t\t\t<h3>Rating: ' + stars + '</h3>\n\t\t\t\t\t\t\t<h3>' + ratingMessage + '</h3>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="fullContain">\n\t\t\t\t\t\t\t<div class="imgContain">\n\t\t\t\t\t\t\t \t<img src="' + spillApp.posterURL + mediaPoster + '">\n\t\t\t\t\t\t\t </div>\n\t\t\t\t\t\t</div>';
	// console.log(userMessage);
	$('.userMedia').append(userMessage);
};
//EVENTS!
spillApp.firstDecision = function () {
	$('.firstDecision > input').on('click', function () {
		$('.getMedia').hide();
		$('.boozeForm').hide();
		$('.boozeFormPartTwo').hide();
		if ($('#userChooseMedia').is(':checked')) {
			$('.boozeForm').fadeIn();
		} else if ($('#userChooseDrink').is(':checked')) {
			$('.getMedia').fadeIn();
		}
	});
}; // end of firstDecision();

spillApp.captureDecision = function () {
	$('#searchMedia').on('click', function (e) {
		e.preventDefault();
		if ($('#userChooseMedia').is(':checked')) {
			var userMediaAllResults = $('#enterMovie').val();
			spillApp.movieDBSearch(userMediaAllResults);
		}
	});
}; //end of captureDecision();

spillApp.captureOtherDecision = function () {
	$('#getMediaSubmit').on('click', function (e) {
		e.preventDefault();
		if ($('#userChooseDrink').is(':checked') && $('input[name=mediaType]').is(':checked')) {
			$('.chooseFirstOption').hide();
			spillApp.userBoozeResult = $('input[name=chooseBooze]:checked').val();
			spillApp.userMediaChoice = $('input[name=mediaType]:checked').val();
			spillApp.discoverMedia(spillApp.userMediaChoice);
			// console.log(spillApp.userBoozeResult);
		} else {
			alert('Come on, pick a content type.');
		}
	});
}; //end of captureOtherDecision();

spillApp.events = function () {
	spillApp.firstDecision();
	spillApp.captureDecision();
	spillApp.submitGetBooze();
	spillApp.captureOtherDecision();
	spillApp.reset();
};

spillApp.displayResults = function (array) {
	spillApp.stopAnimation();
	$('.grid').empty();
	for (item in array) {
		// console.log(array);
		var name = array[item].name;
		var image = array[item].image_url;
		var alcContent = array[item].alcohol_content;
		if (array[item].tasting_note !== null) {
			var tasting = array[item].tasting_note;
		} else {
			var tasting = "Tastes great!";
		}
		if (array[item].style !== null) {
			var tagLine = array[item].style;
		} else {
			var tagLine = 'Yummy!';
		}
		var togetherEl = '<h3>' + name + '</h3>\n\t\t\t\t\t\t\t  <div class="contain">\n\t\t\t\t\t\t\t  \t\t<div class="imageContain">\n\t\t\t\t\t\t\t  \t\t\t<img src="' + image + '" alt="' + name + '">\n\t\t\t\t\t\t\t  \t\t</div>\n\t\t\t\t\t\t\t\t  \t<div class="containText">\n\t\t\t\t\t\t\t\t  \t\t<h4>' + tagLine + '</h4>\n\t\t\t\t\t\t\t\t  \t\t<p>' + tasting + '</p>\n\t\t\t\t\t\t\t\t  \t\t<p> Alcohal Content: ' + alcContent + ' </p>\n\t\t\t\t\t\t\t\t  \t</div>\n\t\t\t\t\t\t\t  \t</div>';
		var finalDiv = $('<div>').addClass('grid-item boozeResultItem').append(togetherEl);
		// console.log(finalDiv);

		$('.grid').append(finalDiv);
		spillApp.asyncFunctionGetBooze(array, item);
	}

	$('.results').show();
};

spillApp.showUserChoice = function (choice) {
	$('.userMedia').empty();
	var userMediaPrint = spillApp.userMediaChoice.toUpperCase();
	// console.log(userMediaPrint);
	var userChoice = $('input[value=' + choice + '][name=chooseBooze]');
	var userBooze = $(userChoice).data('image');
	var elemString = '<h5><span class="mediaChoice">' + userMediaPrint + '</span> selections for your choice of poisin: </h5>\n\t\t\t\t\t\t\t<div class="result">\n\t\t\t\t\t\t\t\t<img src="images/' + userBooze + '.png">\n\t\t\t\t\t\t\t</div>';
	$('.userMedia').append(elemString);
};

spillApp.displayMedia = function (array) {
	spillApp.showUserChoice(spillApp.userBoozeResult);
	$('.grid').empty();
	var movieTitle = 'title';
	var tvTitle = 'name';
	var shuffledResults = _.shuffle(array).slice(0, 10);
	// console.log(spillApp.userMediaChoice);
	if (spillApp.userMediaChoice === 'tv') {
		shuffledResults.forEach(function (item) {
			var description = _.propertyOf(item)('overview');
			var length = description.length;
			//This is only for BayWatch
			if (length > 1016) {
				spillApp.description = 'A great TV show';
			} else {
				spillApp.description = _.propertyOf(item)('overview');
			}
			var titleDesc = '<div class="resultMediaContain">\n\t\t\t\t\t\t\t\t\t<div class="imgContain">\n\t\t\t\t\t\t\t\t\t\t<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '" alt="' + item[tvTitle] + ' Poster">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="overlay">\n\t\t\t\t\t\t\t\t\t\t<h4>' + item[tvTitle] + '</h4>\n\t\t\t\t\t\t\t\t\t \t<p>' + spillApp.description + '</p>\n\t\t\t\t\t\t\t\t\t </div>\n\t\t\t\t\t\t\t\t</div>';
			var elemString = $('<div>').addClass('grid-item mediaResult').append(titleDesc);
			$('.grid').append(elemString);
			spillApp.asyncFunctionGetContent(shuffledResults, item);
		});
	} else if (spillApp.userMediaChoice === 'movie') {
		shuffledResults.forEach(function (item) {
			// console.log('you picked a movie');
			var titleDesc = '<div class="resultMediaContain">\n\t\t\t\t\t\t\t\t<div class="imgContain">\n\t\t\t\t\t\t\t\t\t<img src="https://image.tmdb.org/t/p/w300/' + item.poster_path + '" alt="' + item[movieTitle] + ' Poster">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class="overlay">\n\t\t\t\t\t\t\t\t\t<h4>' + item[movieTitle] + '</h4>\n\t\t\t\t\t\t\t\t \t<p>' + item.overview + '</p>\n\t\t\t\t\t\t\t\t </div>\n\t\t\t\t\t\t\t </div>';
			var elemString = $('<div>').addClass('grid-item mediaResult').append(titleDesc);
			$('.grid').append(elemString);
			spillApp.asyncFunctionGetContent(shuffledResults, item);
		});
	}
};

//This Sequence loads Packery in the correct order
spillApp.callbackGetBooze = function () {
	$('.results').show();
	spillApp.initPackeryGetBooze();
};

spillApp.callbackGetContent = function () {
	$('.results').show();
	spillApp.initPackeryGetContent();
};

spillApp.asyncFunctionGetBooze = function (array, item) {
	spillApp.itemsProcessed++;
	if (spillApp.itemsProcessed === array.length) {
		spillApp.callbackGetBooze();
		spillApp.itemsProcessed === 0;
	}
};

spillApp.asyncFunctionGetContent = function (array, item) {
	spillApp.itemsProcessed++;
	// console.log('running');
	if (spillApp.itemsProcessed === array.length) {
		// var gridSizer = gridSizer;
		spillApp.callbackGetContent();
		spillApp.itemsProcessed === 0;
	}
};

spillApp.itemsProcessed = 0;

spillApp.initPackeryGetContent = function () {
	$('.grid').prepend('<div class="gridSizerTwo">');
	var grid = $('.grid').packery({
		itemSelector: '.grid-item',
		// rowHeight: `${gridSizer}`,
		// columnWidth: `${gridSizer}`,
		percentPosition: true,
		imagesLoaded: true,
		gutter: 20
	});
	grid.imagesLoaded().progress(function () {
		grid.packery();
	});
	spillApp.dragItemsAdd();
};

//disable Draggabilly if on small screen
spillApp.dragItemsAdd = function () {
	if ($(window).width() > 480) {
		$('.grid').find('.grid-item').each(function (i, gridItem) {
			var draggie = new Draggabilly(gridItem);
			$('.grid').packery('bindDraggabillyEvents', draggie);
		});
	}
};

spillApp.initPackeryGetBooze = function () {
	$('.grid').prepend('<div class="grid-sizerOne">');
	var grid = $('.grid').packery({
		itemSelector: '.grid-item',
		rowHeight: '.grid-sizerOne',
		columnWidth: '.grid-sizerOne',
		percentPosition: true,
		imagesLoaded: true,
		gutter: 20
	});
	grid.imagesLoaded().progress(function () {
		grid.packery();
	});
	spillApp.dragItemsAdd();
};

spillApp.reset = function () {
	$('.reload').on('click', function () {
		location.reload();
	});
};

spillApp.init = function () {
	$('.results').hide();
	spillApp.events();
	spillApp.gsapInit();
}; //end of init();

$(function () {
	spillApp.init();
}); //end of Docready

//Add animation
//