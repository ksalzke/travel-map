// get API and other private key information
var airtableBaseId = config.AIRTABLE_BASE_ID;
var airtableApiKey = config.AIRTABLE_API_KEY;

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: new google.maps.LatLng(50.0755, 14.4378)
  });
  var infowindow = new google.maps.InfoWindow();
}

$(document).ready(function() {
  const api =
    "https://api.airtable.com/v0/" +
    airtableBaseId +
    "/Activities?filterByFormula=City%3D%22Prague%22&api_key=" +
    airtableApiKey;

  fetch(api)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < Object.keys(data.records).length; i++) {
        let currentPlaceInfo = data.records[i].fields;
        var marker = new google.maps.Marker({
          map: map,
          place: {
            placeId: currentPlaceInfo.PlaceID,
            location: JSON.parse(currentPlaceInfo.Coordinates)
          },
          title: currentPlaceInfo.Name,
          infowindow: new google.maps.InfoWindow({
            content:
              "<strong>" +
              currentPlaceInfo.Name +
              "</strong><br />" +
              currentPlaceInfo["Opening Hours"],
            maxWidth: 200
          })
        });
        marker.addListener("click", function() {
          return this.infowindow.open(map, this);
        });
      }
    });
});
