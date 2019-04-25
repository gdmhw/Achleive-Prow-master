/* show todays stats on management page */
function allStats(){
	a_totalBookings();
	a_activeUsers();
	a_damagedBikes();
	a_averageSession();
	a_earnings();
	a_activeDock();
}


//total bookings all
function a_totalBookings() {
	url = "https://achleiveprow.tk/api/v1/reservations/manage/count/all"

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
							document.getElementById("totBookingsA").innerHTML =  data.response[0].bookings; //SOMETHING LIKE THIS :)
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


//active users all
function a_activeUsers() {
	url = "https://achleiveprow.tk/api/v1/manage/activeusers/all" //CHANGE THIS

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
							document.getElementById("usersA").innerHTML =  data.response[0].activeUsers;
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


//damagedBikes all
function a_damagedBikes() {
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
							document.getElementById("damagedA").innerHTML =  data.response[0].damagedBikes;
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


//averageSession all
function a_averageSession() {
	url = "https://achleiveprow.tk/api/v1/manage/averagesession/all" //CHANGE THIS

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
							document.getElementById("sessionA").innerHTML =  data.response[0].avgsession;
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

//earnings all
function a_earnings() {
	url = "https://achleiveprow.tk/api/v1/manage/earnings/all" //CHANGE THIS

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
							document.getElementById("earnA").innerHTML =  data.response[0].earnings;
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


//activeDock all
function a_activeDock() {
	url = "https://achleiveprow.tk/api/v1/manage/activedock/all" //CHANGE THIS

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
							document.getElementById("activeA").innerHTML =  data.response[0].dockID;
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
