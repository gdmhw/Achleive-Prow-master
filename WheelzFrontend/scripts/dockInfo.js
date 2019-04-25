/* show todays stats on management page */
function dockInfo() {
  populate();
  dockSelect();
  standard();
}

/* populate the dropdown with docks */
 function populate() {
  let dropdown = document.getElementById('choose');
  dropdown.length = 0;
  let defaultOption = document.createElement('option');
  defaultOption.text = 'Dock List';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  url = "https://achleiveprow.tk/api/v1/docks"

  fetch(url)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }

        // check the text in the response
        response.json().then(function(data) {
          let option;

      	for (let i = 0; i < data.length; i++) {
            option = document.createElement('option');
        	  option.value = data[i].dockid;
        	  dropdown.add(option);
      	}
        });
      }
    )
    .catch(function(err) {
      console.error('Fetch Error -', err);
    });
}

    /* operator page dock selection script */
    function dockSelect() {
    	/* set variable for dock id number */
    	var a = document.getElementById("choose").value;

    	/* locate dock selection form and add dock id number to dock info header */
    	document.getElementById("dockID").innerHTML = "Dock " + a + " Information";

    	/* locate dock selection form and add dock id number to dock modifier header */
    	document.getElementById("dockID2").innerHTML = "Add/Remove Inventory from Dock " + a;
    }




//standard bikes count for specific dock
function standard() {
	url = "https://achleiveprow.tk/api/v1/reservations/manage/count/24"

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
