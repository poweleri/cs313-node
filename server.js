const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

const passwordHash = require('password-hash');


//app.set("views", "views");
//app.set("view engine", "ejs");

app.listen(port, function() {
   console.log(`listening on port: ${port}`);
});


app.get("/getParkingLots", function(req, res){
	console.log(`Getting parking lots`);
	const building = req.query.building || -1;
	getParkingLots(building, function(rows){
		console.log(`DB query complete`);
		res.setHeader('Content-Type', 'application/json');
      	res.end(JSON.stringify(rows));
	});
});

app.get("/getComments", function(req, res){
	console.log(`Getting Comments`);
	const lotId = req.query.lotId;
	getComments(lotId, function(rows){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(rows));
	});
});

app.post("/addRating", function(req, res){
	console.log(`Add Rating to Parking Lot`);
	const parkingLot = req.query.parkingLog;
	const comment = req.query.comment;
	const rating = req.query.rating;
	const user = req.query.userId;
	addRating(parkingLot, comment, rating, user, function(rows) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(rows));
	});
});

app.post("/login", function(req, res){
	console.log(`Logging in`);
	const username = req.query.username;
	const password = req.query.password;
	login(username, password, function(value){
		if (value == -1)
			console.log(`Error in logging in.`);
		 else 
			console.log(`Successful login`);
		
		res.setHeader('Content-Type', 'application/json');
      	res.end(JSON.stringify(value));
	});
});

app.post("/createUser", function(req, res){
	console.log(`Creating user`);
	const username = req.query.username;
	const password = req.query.password;
	if (password !== req.query.conf) {
		console.log(`ERROR: Passwords do not match`);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(-1));
	} else {
		createUser(username, password, function(value) {
			console.log(`User Created Successfully`);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(value));
		});
	}
});



// Model

function getParkingLots(building, handleRequest){
	var queryBuilding = "SELECT pkl.parking_lot_id as id, pkl.description as desc, COALESCE(NULLIF(avg(lc.rating), NULL), '0') as average FROM parking_lot pkl LEFT JOIN lot_comment lc ON pkl.parking_lot_id = lc.parking_lot_id INNER JOIN parking_lot_building_join pklbj ON pklbj.parking_lot_id = pkl.parking_lot_id AND  pklbj.building_id IN ($1) GROUP BY id";
	var queryAll = "SELECT pkl.parking_lot_id as id, pkl.description as desc, pkl.conditions as cond, COALESCE(NULLIF(avg(lc.rating), NULL), \'0\') as average FROM parking_lot pkl LEFT JOIN lot_comment lc ON pkl.parking_lot_id = lc.parking_lot_id GROUP BY id";

	if (building < 1) {
		pool.query(queryAll, [], (err, res) => {
			if (err){
				throw err;
			}
			handleRequest(res.rows);
		});
	}
	else {
		pool.query(queryBuilding, [building], (err, res) => {
			if (err){
				throw err;
			}
			handleRequest(res.rows);
		});		
	}
}

function getComments(parkingLot, handleRequest){
	pool.query("SELECT conditions, description FROM parking_lot WHERE parking_lot_id = $1"
			  , [parkingLot], (err, res) => {
			  	if (err){
			  		throw err;
			  	}
			  	handleRequest(res.rows);
			  });
}

function addRating(parkingLot, comment, rating, user, handleRequest){
	pool.query("INSERT INTO lot_comment (lot_comment_info, rating, usr_id, parking_lot_id) VALUES ($1, $2, $3, $4)"
			  , [comment, rating, user, parkingLot], (err, res) => {
			  	if (err){
			  		throw err;
			  	}
			  	handleRequest(res.rows);
			  });
}

function login(userName, password, handleRequest){
	pool.query('SELECT usr_id, username, password FROM usr WHERE username = $1'
			  , [userName], (err, res) => {
			  	if(err){
			  		throw err;
			  	}
			  	if(passwordHash.verify(password, res.rows[0].password))
			  		handleRequest(res.rows[0].usr_id);
			  	else
			  		handleRequest(-1);
			  });
}

function createUser(userName, password, handleRequest) {
	hashPass = passwordHash.generate(password);
	pool.query('INSERT INTO usr(username, password) VALUES($1, $2)'
			  , [userName, hashPass], (err, res) => {
			  	if (err){
			  		throw err;
			  	}
			  	handleRequest(1);
			  });
}