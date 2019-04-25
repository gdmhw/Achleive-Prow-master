/* show todays stats on management page */
function allStats(){
	w_totalBookings();
	w_activeUsers();
	w_damagedBikes();
	w_averageSession();
	w_earnings();
	w_activeDock();
}


//total bookings week
function w_totalBookings() {
	url = "https://achleiveprow.tk/api/v1/reservations/manage/count/week"

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
    	},
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbkBiZXJsLmluIiwiaWF0IjoxNTUyODQzNTU3LCJleHAiOjE1NTQwNTMxNTd9.qm93Kh4V4dgQtxyBgmFkQ-BPqXP8Q7VE8CCGGE_cpTg (manager)
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15ZW1haWxAbWFpbC5jb20iLCJpYXQiOjE1NTI4NDU4NzQsImV4cCI6MTU1NDA1NTQ3NH0.QW0XqubXkOVrYUQMYnKrryNuNR3fU0Lxs-0SIKKAyec

	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("totBookingsW").innerHTML =  data.response[0].bookings; //SOMETHING LIKE THIS :)
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


//active users week
function w_activeUsers() {
	url = "https://achleiveprow.tk/api/v1/manage/activeusers/week" //CHANGE THIS

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
							document.getElementById("usersW").innerHTML =  data.response[0].activeUsers;
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


//damagedBikes week
function w_damagedBikes() {
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
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("damagedW").innerHTML =  data.response[0].damagedBikes;
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


//averageSession week
function w_averageSession() {
	url = "https://achleiveprow.tk/api/v1/manage/averagesession/week" //CHANGE THIS

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
							document.getElementById("sessionW").innerHTML =  data.response[0].avgsession;
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

//earnings week
function w_earnings() {
	url = "https://achleiveprow.tk/api/v1/manage/earnings/week" //CHANGE THIS

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
							document.getElementById("earnW").innerHTML =  data.response[0].earnings;
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


//activeDock week
function w_activeDock() {
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
							document.getElementById("activeW").innerHTML =  data.response[0].dockID;
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
