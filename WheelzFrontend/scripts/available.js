/* show available stats on operator page */
function availableStats(dockid) {
    bikeCount(dockid);
    //standardCount(dockid);
    //mountainCount(dockid);
    //roadCount(dockid);
    gearCount(dockid);
    //helmetCount(dockid);
    //elbowCount(dockid);
    //pumpCount(dockid);
    //bottleCount(dockid);
    //kneeCount(dockid);
    bikeTotal();
}

/* operator page dock selection script */

function dockSelect() {
    /* set variable for dock id number */
    var a = document.getElementById("choose").value;

    /* locate dock selection form and add dock id number to dock info header */
    document.getElementById("dockID").innerHTML = "Dock " + a + " Information";

    /* locate dock selection form and add dock id number to dock modifier header */
    document.getElementById("dockID2").innerHTML = "Add/Remove Inventory from Dock " + a;

    availableStats(a);
}

function moveBikes() {

    let selector = document.getElementById('type_selector')


    let insertData = {
        bikeCount: document.getElementById('type_amount').value,
        bikeType: selector.options[selector.selectedIndex].text,
        fromDock: document.getElementById("choose").value,
        toDock: document.getElementById("toDock").value
    }


    url = "https://achleiveprow.tk/api/v1/manage/bikes/move/"

    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
        },
        body: JSON.stringify(insertData)
    }).then(
        function (response) {
            response.json().then(
                function (data) {
                    console.log('Request succeeded with JSON response', data);
                    // in here is where you do your thing with your data you got back from the result
                    //document.getElementById("availableStandard").text = "Standard Bikes: " + data.response[0].availableBikes; //CHANGE HERE


                    if (response.status == 403) {
                        console.log('You are not an Operator! Status Code: ' + response.status);
                        document.getElementById("not_operator").innerHTML = "---  Operator access status is required to view this!  ---"
                        return;
                    }

                    if (response.status !== 200) { // you can handle the status codes by checking similar to this
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        alert(data.response.message);
                        return;
                    }

                    if (response.status == 200) {
                        console.log(data.response);
                        alert(data.response.message);
                    }

                    availableStats(document.getElementById("choose").value);

                });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });


}

function bikeCount(dockid) {
    if (!dockid)
        dockid = 0

    document.getElementById("standard-bikes-count").innerHTML = "Standard Bikes: 0";
    document.getElementById("mountain-bikes-count").innerHTML = "Mountain Bikes: 0";
    document.getElementById("road-bikes-count").innerHTML = "Road Bikes: 0";
    document.getElementById("defective-bikes-count").innerHTML = "Defective Bikes: 0";

    url = "https://achleiveprow.tk/api/v1/docks/id/" + dockid + "/bikes/" //CHANGE HERE

    fetch(url, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
        },
    }).then(
        function (response) {
            response.json().then(
                function (data) {
                    console.log('Request succeeded with JSON response', data);
                    // in here is where you do your thing with your data you got back from the result
                    //document.getElementById("availableStandard").text = "Standard Bikes: " + data.response[0].availableBikes; //CHANGE HERE


                    if (response.status == 403) {
                        console.log('You are not an Operator! Status Code: ' + response.status);
                        document.getElementById("not_operator").innerHTML = "---  Operator access status is required to view this!  ---"
                        return;
                    }

                    if (response.status !== 200) { // you can handle the status codes by checking similar to this
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    if (response.status == 200) {
                        var unusable = 0;
                        console.log(data);
                        for (i = 0; i < data.response.length; i++) {
                            if (data.response[i].usable == "no") {
                                unusable++;
                                continue;
                            } else
                                document.getElementById(data.response[i].type + "-bikes-count").innerHTML =
                                    data.response[i].type[0].toUpperCase() + data.response[i].type.substring(1) + " Bikes: " + data.response[i].count;

                        }
                        document.getElementById("defective-bikes-count").innerHTML = "Defective Bikes: " + unusable;
                    }

                });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}

function bikeTotal() {
    url = "https://achleiveprow.tk/api/v1/bikes/"

    document.getElementById("available-mountain").innerHTML = "Mountain Bikes: 0";
    document.getElementById("available-standard").innerHTML = "Standard Bikes: 0";
    document.getElementById("available-road").innerHTML = "Road Bikes: 0";


    fetch(url, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
        },
    }).then(
        function (response) {
            response.json().then(
                function (data) {
                    console.log('Request succeeded with JSON response', data);
                    // in here is where you do your thing with your data you got back from the result
                    //document.getElementById("availableStandard").text = "Standard Bikes: " + data.response[0].availableBikes; //CHANGE HERE


                    if (response.status == 403) {
                        console.log('You are not an Operator! Status Code: ' + response.status);
                        document.getElementById("not_operator").innerHTML = "---  Operator access status is required to view this!  ---"
                        return;
                    }

                    if (response.status !== 200) { // you can handle the status codes by checking similar to this
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    if (response.status == 200) {
                        var unusable = 0;
                        var values = {mountain: 0, standard: 0, road: 0, defective: 0};
                        for (i = 0; i < data.response.length; i++) {
                            if (data.response[i].usable == "yes") {
                                values[data.response[i].type] = values[data.response[i].type] + 1;
                            } else {
                                values.defective++;
                            }
                        }


                        document.getElementById("available-mountain").innerHTML = "Mountain Bikes: " + values["mountain"];
                        document.getElementById("available-standard").innerHTML = "Standard Bikes: "+ values["standard"];
                        document.getElementById("available-road").innerHTML = "Road Bikes: "+ values["road"];
                        document.getElementById("available-defective").innerHTML = "Defective Bikes: "+ values["defective"];

                    }

                });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}


function gearCount(dockid) {
    if (!dockid)
        dockid = 0

    document.getElementById("helmet-count").innerHTML = "Helmets: 0";
    document.getElementById("pump-count").innerHTML = "Pumps: 0";
    document.getElementById("knee-guard-count").innerHTML = "Knee Guards: 0";
    document.getElementById("elbow-pads-count").innerHTML = "Elbow Pads: 0";
    document.getElementById("water-bottle-count").innerHTML = "Water Bottles: 0";

    url = "https://achleiveprow.tk/api/v1/docks/id/" + dockid + "/gear/" //CHANGE HERE

    fetch(url, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": sessionStorage.token // you want this for any of the authenticated endpoints
        },
    }).then(
        function (response) {
            response.json().then(
                function (data) {
                    console.log('Request succeeded with JSON response', data);
                    // in here is where you do your thing with your data you got back from the result
                    //document.getElementById("availableStandard").text = "Standard Bikes: " + data.response[0].availableBikes; //CHANGE HERE


                    if (response.status == 403) {
                        console.log('You are not an Operator! Status Code: ' + response.status);
                        document.getElementById("not_operator").innerHTML = "---  Operator access status is required to view this!  ---"
                        return;
                    }

                    if (response.status !== 200) { // you can handle the status codes by checking similar to this
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }

                    if (response.status == 200) {
                        var unusable = 0;
                        for (i = 0; i < data.response.length; i++) {
                            if (data.response[i].type == "helmet")
                                document.getElementById("helmet-count").innerHTML = "Helmets: " + data.response[i].count;

                            if (data.response[i].type == "pump")
                                document.getElementById("pump-count").innerHTML = "Pumps: " + data.response[i].count;

                            if (data.response[i].type == "knee guard")
                                document.getElementById("knee-guard-count").innerHTML = "Knee Guards: " + data.response[i].count;

                            if (data.response[i].type == "elbow pads")
                                document.getElementById("elbow-pads-count").innerHTML = "Elbow Pads: " + data.response[i].count;

                            if (data.response[i].type == "water bottle")
                                document.getElementById("water-bottle-count").innerHTML = "Water Bottles: " + data.response[i].count;

                        }
                    }

                });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
}
