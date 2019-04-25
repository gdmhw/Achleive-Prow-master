/* reservation page button to show only 'active' bookings */

function showActive() {

	/* locate class 'history_content' */
	let d = document.getElementsByClassName('history_content');

	for (let f = 0; f < d.length; f++) {

    	let e = d[f];

    	let div = e.innerHTML.trim();

    	if (div == 'Reserved' || div == 'Ended' || div == 'Cancelled') {

        	e.style.display = 'none';

   		 }
	}
}


/* NOT USED NOW */