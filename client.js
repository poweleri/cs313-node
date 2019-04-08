function getMovies() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(JSON.parse(xhttp.responseText));
		}
	};
	var query = document.getElementById("query").value;
	var url = "http://www.omdbapi.com/?apikey=byuidaho&s=" + query;
	url = encodeURI(url);
	console.log("url:", url);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function callback(data) {
  // Clear movie list
  document.getElementById("movieList").innerHTML = "";

	// get data
	var movies = data.Search;

	for (var i = 0; i < movies.length; i++) {
		var movie = movies[i];
		addMovie(movie);
	}
}


function addMovie(movieObj) {
	var movie = document.createElement("div");
	var title = document.createTextNode(movieObj.Title);
	movie.appendChild(title);

	var dtlButton = document.createElement("button");
	var dtlDiv = document.createElement("div");

	dtlButton.setAttribute("id", "btn-" + movieObj.imdbID);
	dtlButton.appendChild(document.createTextNode("Details"));
	dtlButton.addEventListener("click", function() {
		getMovieDetails(movieObj.imdbID);
	});

	dtlDiv.setAttribute("id", movieObj.imdbID);
	movie.appendChild(dtlButton);
	movie.appendChild(dtlDiv);

	document.getElementById("movieList").appendChild(movie);
}

function callbackDtls(movieObj) {
	var yearDiv = document.createElement("div");
	var ratedDiv = document.createElement("div");
	var year = document.createTextNode(movieObj.Year);
	var rated = document.createTextNode(movieObj.Rated);
	yearDiv.appendChild(year);
	ratedDiv.appendChild(rated);

	var dtlsDiv = document.getElementById(movieObj.imdbID);
  dtlsDiv.innerHTML = "";
	dtlsDiv.appendChild(yearDiv);
	dtlsDiv.appendChild(ratedDiv);

	var btnHide = document.createElement("button");
	btnHide.appendChild(document.createTextNode("Hide"));
	btnHide.addEventListener("click", function() {
		document.getElementById(movieObj.imdbID).innerHTML = "";
	});
	dtlsDiv.appendChild(btnHide);
}

function getMovieDetails(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callbackDtls(JSON.parse(xhttp.responseText));
		}
	};
	var url = "http://www.omdbapi.com/?apikey=byuidaho&i=" + id;
	url = encodeURI(url);
	console.log("url:", url);
	xhttp.open("GET", url, true);
	xhttp.send();
}
