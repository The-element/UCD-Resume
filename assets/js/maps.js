function initMap() { //the function beign envoked when an api is called.
    var map = new google.maps.Map(document.getElementById("map"), {   //This object(google.maps.Map()) is provided by the Google Maps API. We parse in the div id to where it should be placed.
        zoom: 3,    //a parametar to adjust map zoom.
        center: {   //a parametar to adjust what part of the map is showing.
            lat: 46.619261,
            lng: -33.134766
        }
    });

    var labels = "ABCDEFGHIJKLMONPQRSTUVWXYZ";

    var locations = [   //A varible storing the markers location as objects in an array.
        { lat: 40.785091, lng: -73.968285 },
        { lat: 41.084045, lng: -73.874256 },
        { lat: 40.754932, lng: -73.984016 }
    ];

    var markers = locations.map(function (location, i) { //a variable storing the returned marker after the function has been run. We parse in the locations and then call the function maps, which contains a function in which we parse in the location and the index.
        return new google.maps.Marker({ //a method provided by the google api to create the marker.
            position: location, //tells it that the position is that of the object in the array "location".
            label: labels[i % labels.length] //tells it that the label should be the value of the first index of the string stored in the variable "labels", and that the value used from that index should be removed from the variable.
        });
    });

    //The map method in JavaScript works similar to a forEach() function. The difference is that this returns an array with the results of looping through each item in our locations array.

    var markerCluster = new MarkerClusterer(map, markers, { //the variable markerCluster stores the image of the marker together with the map and markers location.
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });
}