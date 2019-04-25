// AIzaSyACiXMw6_lBO0vBNnBnNMOygia46o1Qvpw

var map;
var infoWindow;
var userPosition;

var bikeLocations = [];
var dockLocations = [];



//var Promise = require('es6-promise').Promise;

var waverlyGps = {
  lat: 55.9522314,
  lng: -3.18867390020952
};

var hwGps = {
  lat: 55.910291,
  lng: -3.323458
};

var princesStps = {
  lat: 55.953251,
  lng: 	-3.188267
};

var haymarketStationGps = {
  lat: 55.9410862356 ,
  lng: -3.21678579952
};

var fountainparkGps = {
  lat: 55.9420,
  lng: -3.2168
};

//path to markers
var markerIconBase = "img/images/";

/*google's sample icons*/
//var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

var icons = {
  bike: {
    name: 'Bike',
    icon: markerIconBase + 'm1.png'//'bike-logo.png'
  },
  dock: {
    name: 'Docking Station',
    icon: markerIconBase + 'm2.png'
  },

  user: {
    name: 'Current Location',
    icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png'
  }


};



function initMap() {

  //set location coordinates

  //map init and options

  map = new google.maps.Map(document.getElementById('map'), {
    //where map starts out - default is uni
    center: /*new google..LatLng(-33.91722, 151.23064)*/ hwGps,

    disableDefaultUI: false,
    draggable: true,
    //map type used
    mapTypeID: google.maps.MapTypeId.ROADMAP,

    //zoom options
    zoom: 11, //where zoom begins at
    minzoom: 18,
    maxzoom: 15,

    zoomControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT,
      style: google.maps.ZoomControlStyle.DEFAULT
    },

    panControlOptions: {
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
  });







    var contentString = 'This is a test string for info Windows';

  var infoWindow = new google.maps.InfoWindow({
    content: contentString
  });





  //current user/device locations
  // Try HTML5 geolocation.
  //if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

        //needs to be in here for user icon
        var usermark = new google.maps.Marker({
               position: userPosition,
               icon: 'http://www.robotwoods.com/dev/misc/bluecircle.png',
               map: map
             });



      /*infoWindow.setPosition(pos);
      infoWindow.setContent('Current Location');
      infoWindow.open(map);*/
      map.setCenter(userPosition);
    });









  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  function directions(destMarker){
    var request = {};
    request.travelMode = google.maps.DirectionsTravelMode.DRIVING;

    request.origin = userPosition;
    request.destination = destMarker;
    directionsService.route(request, function(response, status){
      if(status == google.maps.DirectionsStatus.OK){
        directionsDisplay.setDirections(response);
      }else alert("Directions not found: " + status);
    });


  }



  //loaction tytpes and locations, testing locations are in Sydney
  // TODO: edinburgh custom locations
  var locations = [
    //bike positions - simulated
    {
      position: hwGps,
      type: 'bike'
    },
    {
      position: waverlyGps,
      type: 'bike'
    },
    {
      position: haymarketStationGps,
      type: 'dock'
    },
    {
      position: fountainparkGps,
      type: 'dock'
    },
    {
      position: princesStps,
      type: 'dock'
    }
  ];


  //this loads in the docks from the api

//  var clustMarkers = [];
  var clust2 = [];

  var clustOptions = {


    maxZoom: 13,
    imagePath: 'img/clusterImages/m',
    styles: [{
      url:'img/clusterImages/m1.png',
        textSize: 20,
      textColor: "#d10a00",
      backgroundColor: "blue",
      height: 55,
      width: 54,
      anchor: [6, 0]

    }]




  };



  var url = "https://achleiveprow.tk/api/v1/docks/";
  fetch(url).then((res) => res.json())
  .then(function(data) {
    console.log("got docks from server");
    console.log(data.response.length);
    var i = 0;
    for (i = 0; i < data.response.length; i++) {
      console.log("helo");
      dockLocations.push({position: {lat: parseFloat(data.response[i].latitude), lng: parseFloat(data.response[i].longitude)}, type: 'dock'});



    }
    dockLocations.forEach(function(location) {

      var dockMarker = new google.maps.Marker({
        position: location.position,
        icon: 'img/clusterImages2/m2.png',
        //animation: google.maps.Animation.DROP,
        map: map
      });

        //clustMarkers.push(dockMarker);




      dockMarker.addListener('click', function(){
        //when marker is clicked:
        var dockloc = location.position;
        console.log("This is a dock location:");
        console.log(dockloc);
        //infoWindow.open(map, marker);
        directions(dockMarker.position);
      });

    });
    //var markerCluster = new MarkerClusterer(map, clustMarkers, clustOptions1);
  });

  console.log(dockLocations);

  /*var clust1Style = [{
    offsetX: 2,
    offset: 2,
  //url: 'img/clusterImages/m1.png'
  }];
  var clustOptions = {
    imagePath: 'img/clusterImages/clusterImages2/m',
      //imagePath: 'img/Images/m',
    maxZoom: 16,
    styles: clust1Style


  };*/

  var url = "https://achleiveprow.tk/api/v1/bikes/";
  fetch(url).then((res) => res.json())
  .then(function(data) {
    console.log("got bikes from server");
    console.log(data.response.length);
    var i = 0;
    for (i = 0; i < data.response.length; i++) {
      console.log("helo");
      bikeLocations.push({position: {lat: parseFloat(data.response[i].latitude), lng: parseFloat(data.response[i].longitude)}, type: 'bike'});
    }
    bikeLocations.forEach(function(location) {
      var bikeMarker = new google.maps.Marker({
        position: location.position,
        //animation: google.maps.Animation.DROP,
        icon: 'img/clusterImages/clusterImages2/m1.png',
        map: map
      });

      clust2.push(bikeMarker);

      bikeMarker.addListener('click', function(){
        var bikeloc= location.position;
        console.log("This is a bike location:");
        console.log(bikeloc);
        //infoWindow.open(map, bikeMarker);
        directions(bikeMarker.position);
      });
    });
      var markerCluster2 = new MarkerClusterer(map, clust2, clustOptions);
  });

  console.log(bikeLocations);


  //legend table creation
  var legend = document.getElementById('legend');
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  };

  //push legend table onto map
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(legend);







}




function callMarker(){
  // Create an array of alphabetical characters used to label the markers.
 var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


 var locations2 = [
   {lat: -31.563910, lng: 147.154312},
   {lat: -33.718234, lng: 150.363181},
   {lat: -33.727111, lng: 150.371124},
   {lat: -33.848588, lng: 151.209834},
   {lat: -33.851702, lng: 151.216968},
   {lat: -34.671264, lng: 150.863657},
   {lat: -35.304724, lng: 148.662905},
   {lat: -36.817685, lng: 175.699196},
   {lat: -36.828611, lng: 175.790222},
   {lat: -37.750000, lng: 145.116667},
   {lat: -37.759859, lng: 145.128708},
   {lat: -37.765015, lng: 145.133858},
   {lat: -37.770104, lng: 145.143299},
   {lat: -37.773700, lng: 145.145187},
   {lat: -37.774785, lng: 145.137978},
   {lat: -37.819616, lng: 144.968119},
   {lat: -38.330766, lng: 144.695692},
   {lat: -39.927193, lng: 175.053218},
   {lat: -41.330162, lng: 174.865694},
   {lat: -42.734358, lng: 147.439506},
   {lat: -42.734358, lng: 147.501315},
   {lat: -42.735258, lng: 147.438000},
   {lat: -43.999792, lng: 170.463352}
 ]

  var markers2 = locations2.map(function(location, i) {
    return new google.maps.Marker({
      position: location,
      label: labels[i % labels.length]
    });
  });



  var markerCluster3 = new MarkerClusterer(map, markers2,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

//function initMarkers(){
//  initMap();
//  callMarkers();
//}

//console.log("here are the dock locations:" + dockMarker);
