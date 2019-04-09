const URL = window.location.href;
var userId = -1;

function getBuildings(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var rows = JSON.parse(xhttp.responseText);
			var buildings = document.createElement("p");
			buildings.setAttribute("id", "buildings");


			var building = document.createElement("button");
			building.setAttribute("type", "button");
			building.appendChild(document.createTextNode("All Buildings"));
			building.addEventListener("click", function(){
				getParkingLots(-1);
			});
			
			buildings.appendChild(building);
			buildings.appendChild(document.createElement("br"));			

			for (var i = 0; i < rows.length; i++) {
				building = createSearchButton(rows[i])

				buildings.appendChild(building);
				buildings.appendChild(document.createElement("br"));	
			}	

			document.getElementById("buildings").appendChild(buildings);
		}
	};
	var url = URL + "getBuildings";
	url = encodeURI(url);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function createSearchButton(row){
	var building = document.createElement("button");
	building.setAttribute("type", "button");
	building.appendChild(document.createTextNode(row.description));
	building.addEventListener("click", function(){
		getParkingLots(row.id);
	});

	return building;
}

function getParkingLots(building){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			clearChildren(document.getElementById("ParkingLots"));
			var rows = JSON.parse(xhttp.responseText);
			for (var i = 0; i < rows.length; i++) {
				createParkingLot(rows[i]);
			}
		}
	};
	var url = URL + "getParkingLots?building=" + building;
	url = encodeURI(url);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function createParkingLot(row){
	var parkingLotHead = document.createElement("div");
	parkingLotHead.setAttribute("id", "parkingLot-" + row.id);

	var parkingLotDesc = document.createElement("h3");
	parkingLotDesc.appendChild(document.createTextNode(row.desc));

	var rating = document.createTextNode("Rating: " + row.average);
	parkingLotDesc.appendChild(rating);

	var commentButton = document.createElement("button");
	//commentButton.setAttribute("id", "LotComments-" + row.id);
	commentButton.appendChild(document.createTextNode("Get Comments"));
	commentButton.addEventListener("click", function(){
		getComments(row.id);
	});

	var commentDiv = document.createElement("div");
	commentDiv.setAttribute("id", "LotComments-" + row.id);

	parkingLotHead.appendChild(parkingLotDesc);
	parkingLotHead.appendChild(rating);
	parkingLotHead.appendChild(commentButton);
	parkingLotHead.appendChild(commentDiv);

	document.getElementById("ParkingLots").appendChild(parkingLotHead);
}


function getComments(lotId){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			clearChildren(document.getElementById("LotComments-" + lotId));
			var rows = JSON.parse(xhttp.responseText);
			for (var i = 0; i < rows.length; i++) {
				createComments(rows[i], lotId);
			}
			createCommentForm(lotId);
		}
	};
	var url = URL + "getComments?lotId=" + lotId;
	url = encodeURI(url);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function createComments(row, lotId){
	var commentHead = document.createElement("div");
	commentHead.setAttribute("class", "row");

	var p  = document.createElement("p");
	var br = document.createElement("br");
	
	var comment = document.createElement("textarea");
	comment.setAttribute("disabled", "true");
	comment.appendChild(document.createTextNode(row.note));

	var rating = document.createTextNode("Rating: " + row.rating);
	var username = document.createTextNode("User: " + row.username);

	p.appendChild(comment);
	p.appendChild(br);
	p.appendChild(rating);
	p.appendChild(br);
	p.appendChild(username);

	commentHead.appendChild(p);
	document.getElementById("LotComments-" + row.id).appendChild(commentHead);
}

function createCommentForm(lotId){
	var commentHead = document.createElement("div");
	commentHead.setAttribute("class", "row");

	var form = document.createElement("form");
	form.setAttribute("id", "newComment-" + lotId);
	var br = document.createElement("br");

	var comment = document.createElement("textarea");
	comment.setAttribute("name", "comment");
	form.appendChild(comment);
	form.appendChild(br);

	for (var i = 0; i < 5; i++) {
		var rating = document.createElement("input");
		rating.setAttribute("type", "radio");
		rating.setAttribute("id", "rating");
		rating.setAttribute("value", (i + 1));
		if (i === 4)
			rating.setAttribute("checked", "true");

		form.appendChild(document.createTextNode((i + 1).toString() + ": "));
		form.appendChild(rating);
	}
	form.appendChild(br);

	var submit = document.createElement("input");
	submit.setAttribute("type", "button");
	submit.setAttribute("value", "Add Comment");
	submit.addEventListener("click", function(){
		addRating(lotId);
	});
	form.appendChild(submit);

	commentHead.appendChild(form);
	document.getElementById("LotComments-" + lotId).appendChild(commentHead);
}

function addRating(lotId){
	if (userId > 0){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				getParkingLots();
				getComments(lotId);
			}
		};

		var formData = new FormData(document.getElementById("newComment-" + lotId));
		formData.append("lotId", lotId);
		formData.append("userId", userId);

		var url = URL + "addRating";
		url = encodeURI(url);
		xhttp.open("POST", url, true);
		xhttp.send(formData);
	} else {
		alert("You must be signed in to add a rating");
	}
}

function login(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var row = JSON.parse(xhttp.responseText);
			if (row.usr_id == -1){
				alert("Error: Incorrect Login Credentials");
			} else {
				document.getElementById("username").innerhtml = row.username;
				userId = row.usr_id;
				displaySearch();
				document.getElementById("logoutButton").style.display = "block";
				document.getElementById("loginButton").style.display = "none";
			}
		}
	};

	var formData = "username=" + document.getElementById("l-username").value 
				 + "&password=" + document.getElementById("l-password").value;

	var url = URL + "login";
	url = encodeURI(url);
	xhttp.open("POST", url, true);
	xhttp.send(formData);
}

function createUser(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var row = JSON.parse(xhttp.responseText);
			if (row.res == -1){
				alert("Error: Passwords do not match");
			} else {
				alert("User succesfully created")
			}
		}
	};

	var formData = "username=" + document.getElementById("c-username").value 
				 + "&password=" + document.getElementById("c-password").value
				 + "&conf=" + document.getElementById("c-conf").value;

	var url = URL + "createUser";
	url = encodeURI(url);
	xhttp.open("POST", url, true);
	xhttp.send(formData);
}

function displaySearch(){
	document.getElementById("loginBlock").style.display = "none";
	document.getElementById("searchBlock").style.display = "block";
}

function displayLogin(){
	document.getElementById("loginBlock").style.display = "block";
	document.getElementById("searchBlock").style.display = "none";
}

function logout(){
	userId = -1;
	document.getElementById("logoutButton").style.display = "none";
	document.getElementById("loginButton").style.display = "block";
}

function clearChildren(thing){
	while (thing.firstChild) {
	    thing.removeChild(thing.firstChild);
	}
}

window.onload = getBuildings();