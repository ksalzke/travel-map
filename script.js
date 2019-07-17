// get API and other private key information
var airtableBaseId = config.AIRTABLE_BASE_ID;
var airtableApiKey = config.AIRTABLE_API_KEY;

// initialise map and create info window
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: new google.maps.LatLng(50.0755, 14.4378)
  });
  var infowindow = new google.maps.InfoWindow();
}

function showActivities(city) {
  // ADD ACCOMMODATION MARKER TO MAP
  const accommodationApi =
    "https://api.airtable.com/v0/" +
    airtableBaseId +
    "/Accommodation?filterByFormula=City%3D%22" +
    city +
    "%22&api_key=" +
    airtableApiKey;

  fetch(accommodationApi)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < Object.keys(data.records).length; i++) {
        // iterate through matched place records

        let currentPlaceInfo = data.records[i].fields;

        // add place marker and info window information
        var marker = new google.maps.Marker({
          map: map,
          place: {
            placeId: currentPlaceInfo.PlaceID,
            location: JSON.parse(currentPlaceInfo.Coordinates)
          },
          title: currentPlaceInfo.Name,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          },
          infowindow: new google.maps.InfoWindow({
            content: "<strong>" + currentPlaceInfo.Name + "</strong>",
            maxWidth: 200
          })
        });
        marker.addListener("click", function() {
          return this.infowindow.open(map, this);
        });
      }
    });

  // ADD ACTIVITIES MARKERS TO MAP
  const activitiesApi =
    "https://api.airtable.com/v0/" +
    airtableBaseId +
    "/Activities?filterByFormula=City%3D%22" +
    city +
    "%22&api_key=" +
    airtableApiKey;

  fetch(activitiesApi)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < Object.keys(data.records).length; i++) {
        // iterate through matched place records

        let currentPlaceInfo = data.records[i].fields;

        // for various fields, get blank string if empty otherwise format for info window
        let openingHours =
          typeof currentPlaceInfo["Opening Hours"] !== "undefined"
            ? "<br />" + currentPlaceInfo["Opening Hours"]
            : "";
        let price =
          typeof currentPlaceInfo["Price"] !== "undefined"
            ? "<br />" + currentPlaceInfo["Price"]
            : "";
        let rating =
          typeof currentPlaceInfo["Rating"] !== "undefined"
            ? currentPlaceInfo["Rating"].toString()
            : "";
        let notes =
          typeof currentPlaceInfo["Notes"] !== "undefined"
            ? "<br />" + currentPlaceInfo["Notes"]
            : "";
        let website =
          typeof currentPlaceInfo["Website"] !== "undefined"
            ? "<br /><a href='" + currentPlaceInfo["Website"] + "'>Website</a>"
            : "";

        // add place marker and info window information
        var marker = new google.maps.Marker({
          map: map,
          place: {
            placeId: currentPlaceInfo.PlaceID,
            location: JSON.parse(currentPlaceInfo.Coordinates)
          },
          title: currentPlaceInfo.Name,
          label: rating,
          infowindow: new google.maps.InfoWindow({
            content:
              "<strong>" +
              currentPlaceInfo.Name +
              "</strong>" +
              openingHours +
              price +
              notes +
              website,
            maxWidth: 200
          })
        });
        marker.addListener("click", function() {
          return this.infowindow.open(map, this);
        });
      }
    });
}

$(document).ready(function() {
  showActivities("Prague");

  $("#getactivitiesbutton").click(function() {
    function updateCenter(place) {
      let geocodeAPI =
        "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        place +
        "&key=" +
        config.GOOGLE_MAPS_API_KEY;

      fetch(geocodeAPI)
        .then(res => res.json())
        .then(data => {
          let latitude = data.results[0].geometry.location.lat;
          let longitude = data.results[0].geometry.location.lng;
          map.panTo(new google.maps.LatLng(latitude, longitude));
        });
    }

    city = $("#citynamesearchtext").val();
    showActivities(city);
    updateCenter(city);
  });
});
