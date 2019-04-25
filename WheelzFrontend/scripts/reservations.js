/* show available stats on operator page */
function reservations(){
	allReservations();
}


//load all reservations
function allReservations() {
	url = "https://achleiveprow.tk/api/v1/reservations/all" //CHANGE HERE

	fetch(url, {
			method: 'get',
    	headers: {
    	"Content-type": "application/json; charset=UTF-8",
      "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hbkBiZXJsLmluIiwiaWF0IjoxNTUyODQzNTU3LCJleHAiOjE1NTQwNTMxNTd9.qm93Kh4V4dgQtxyBgmFkQ-BPqXP8Q7VE8CCGGE_cpTg" // you want this for any of the authenticated endpoints
    	},
	}).then(
    	function(response) {
        	response.json().then(
						function(data) {
            	console.log('Request succeeded with JSON response', data);
            	// in here is where you do your thing with your data you got back from the result
							document.getElementById("history_content").innerHTML =  data.response[0].reservation; //CHANGE HERE


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
