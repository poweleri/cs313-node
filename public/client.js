const URL = window.location.href;

function getParkingLots(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			func
		}
	};
	var query = document.getElementById("query").value;
	var url = URL + "/getParkingLots";
	url = encodeURI(url);
	console.log("url:", url);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function getComments(){

}

function addRating(){

}

function login(){

}

function createUser(){

}