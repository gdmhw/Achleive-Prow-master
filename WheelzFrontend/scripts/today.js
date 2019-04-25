/* show todays stats on management page */
function allStats(){
	totalBookings();
	activeUsers();
	damagedBikes();
	averageSession();
	earnings();
	activeDock();
}


//total bookings 24hr
function totalBookings() {
	url = "https://achleiveprow.tk/api/v1/reservations/manage/count/24"

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbkBiZXJsLmluIiwiaWF0IjoxNTUyODQzNTU3LCJleHAiOjE1NTQwNTMxNTd9.qm93Kh4V4dgQtxyBgmFkQ-BPqXP8Q7VE8CCGGE_cpTg (manager)
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15ZW1haWxAbWFpbC5jb20iLCJpYXQiOjE1NTI4NDU4NzQsImV4cCI6MTU1NDA1NTQ3NH0.QW0XqubXkOVrYUQMYnKrryNuNR3fU0Lxs-0SIKKAyec
//    body: JSON.stringify({"period": "24"}) // how to send it data
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("totBookings24").innerHTML =  data.response[0].bookings; //SOMETHING LIKE THIS :)
						//	const module = require('module');

							if (response.status == 403) {
									console.log('You are not a Manager! Status Code: ' + response.status);
									document.getElementById("not_manager").innerHTML = "---  Manager access status is required to view this!  ---"
									return;
							}

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}


//active users 24hr
function activeUsers() {
	url = "https://achleiveprow.tk/api/v1/manage/activeusers/" //CHANGE THIS

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("users24").innerHTML =  data.response[0].activeUsers;
						//	const module = require('module');

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}


//damagedBikes 24hr
function damagedBikes() {
	url = "https://achleiveprow.tk/api/v1/manage/damagedbikes/" //CHANGE THIS

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result#

							document.getElementById("damaged24").innerHTML =  data.response[0].damagedBikes;
						//	const module = require('module');

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}


//averageSession 24hr
function averageSession() {
	url = "https://achleiveprow.tk/api/v1/manage/averagesession/" //CHANGE THIS

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("session24").innerHTML =  data.response[0].avgsession;
						//	const module = require('module');

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}

//earnings 24hr
function earnings() {
	url = "https://achleiveprow.tk/api/v1/manage/earnings/" //CHANGE THIS

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("earn24").innerHTML =  data.response[0].earnings;
						//	const module = require('module');

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}


//activeDock 24hr
function activeDock() {
	url = "https://achleiveprow.tk/api/v1/manage/activedock/" //CHANGE THIS

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("active24").innerHTML =  data.response[0].dockID;
						//	const module = require('module');

            	if (response.status !== 200) { // you can handle the status codes by checking similar to this
                	console.log('Looks like there was a problem. Status Code: ' +
                	response.status);
                	return;
            	}

        	});
    	}
	).catch(function(err) {
    	console.log('Fetch Error :-S', err);
	});
}
