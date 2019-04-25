function onload(callback) {
    let authToken = "";
    if (typeof (Storage) !== "undefined") {
        // If webstorage sessionStorage is allowed.
        if (!sessionStorage.token) {
            // Init a new token in session storage
            sessionStorage.token = "";
        } else {
            // Load our token from storage
            authToken = sessionStorage.token;
        }


        checkToken(authToken, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                sessionStorage.loggedIn = true;
                sessionStorage.type = result.type;

                if (sessionStorage.type == "manager") {
                    document.getElementById("man").className = "";
                    document.getElementById("op").className = "";
                    document.getElementById("res").className = "";
                }

                if (sessionStorage.type == "operator") {
                    document.getElementById("op").className = "";
                    document.getElementById("res").className = "";
                }
            }
        });








        if (callback)
            callback();

    }

}

function checkToken(authToken, callback) {


    let url = "https://achleiveprow.tk/api/v1/accounts/checktoken"
    fetch(url, {
        method: 'get',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": authToken // <-- var from above, or a string "accesstokenfromlogin" // you want this for any of the authenticated endpoints
        }}).then(
        function (response) {
            response.json().then(function (data) {
                console.log('Request succeeded with JSON response', data);
                // in here is where you do your thing with your data you got back from the result

                if (response.status !== 200) { // you can handle the status codes by checking similar to this
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }


                //--------------[ store the type ]----------
                if (response.status == 200) {
                    document.getElementById("login").text = "Logout";
                    document.getElementById("login").onclick = logout;

                    callback(null, data.response);

                } else {
                    callback(response, null);
                    //failed to login
                    console.log(data.response.message);
                }
                //--------------[ store the type end ]--------------
            });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

}

function logout() {
    sessionStorage.token = "0";
    document.getElementById('login').text = "Login";
    document.getElementById('login').onclick = null;
}

function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    logininfo(email, password);
}

function logininfo(email, password) {

    console.log(email)
    console.log(password)

    var authToken = "";

    if (typeof (Storage) !== "undefined") {
        // If webstorage sessionStorage is allowed.
        if (!sessionStorage.token) {
            // Init a new token in session storage
            sessionStorage.token = "";
        } else {
            // Load our token from storage
            authToken = sessionStorage.token;
        }
    } else {
        // Not sure of the alt options...
    }


    var url = "https://achleiveprow.tk/api/v1/accounts/login"

    fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": authToken // <-- var from above, or a string "accesstokenfromlogin" // you want this for any of the authenticated endpoints
        },
        body: JSON.stringify({"email": email, "password": password}) // how to send it data, like html form, "field": "value"
    }).then(
        function (response) {
            response.json().then(function (data) {
                console.log('Request succeeded with JSON response', data);
                // in here is where you do your thing with your data you got back from the result

                if (response.status !== 200) { // you can handle the status codes by checking similar to this
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }


                //For accounts/login/ you want to store the token
                //--------------[ start storing token ]----------
                if (response.status == 200) {
                    if (typeof (Storage) !== "undefined") {
                        document.getElementById("login").text = "Logout";
                        document.getElementById("login").onclick = logout;

                        sessionStorage.loggedIn = true;
                        sessionStorage.token = data.response.token;
                        authToken = data.response.token;

                        window.location.href = "index.html";
                    }
                } else {
                    //failed to login
                    console.log(data.response.message);
                }
                //--------------[ end store token ]--------------
            });
        }
    ).catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

}