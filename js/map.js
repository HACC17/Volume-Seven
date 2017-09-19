$(document).ready(function() {

  // initiate map and set view above the oahu at zoom of 5
  var map = L.map('pollsMap').setView([21.438912, -158.000057], 5);




    // set base map layer to streets
    L.esri.basemapLayer('Streets').addTo(map);
    // get feature layer from honolulu gis map of poll stations
    // this might need to be changed to https?
    var polls = L.esri.featureLayer({
      url:'http://webserverholis.honolulugis.org/arcgis/rest/services/Public/Administrative_Political/MapServer/8'
    }).addTo(map);


        console.log("this is polls", polls);

        var whereTo = "PRECINCTID = '40-02'";
        // This is an option to zoom at the lowest level at the marker that matched the precinct id
        polls.query().where(whereTo).bounds(function(error, latLngBounds, response){
          map.fitBounds(latLngBounds).setZoom(17);
        });

    // user location variable currently set to string but should be changed to city of users location from the database
    var userLocation = 'Waianae';

    // wait for feature layer to load then run geocode to fit boundaries to user
    /*
    polls.once("load", function(evt) {

      L.esri.Geocoding.geocode().text(userLocation).run(function(err, response){

        map.fitBounds(response.results[0].bounds);
      });


    });
    */

    // variables to generate directions parameters from feature layer property fields
    var address;
    var placeName;

    // Bind polls maerk to popup
    polls.bindPopup(function(layer) {
      placeName = layer.feature.properties.NAME;
      address = layer.feature.properties.ADDRESS;
      //console.log('layer', layer.feature.properties);
      // inner html of properties available and other functionality
      return L.Util.template(
        '<h4>{NAME} <small>({PRECINCTID})</small></h4><p><b>{ADDRESS}</b><br><hr><button class="trigger btn btn-primary">Directions</button>',
      layer.feature.properties);
    });

        /*
        // When click poll marker access methods available to popup
        // Not currently needed.
        polls.on('click', onClick);
        function onClick(e) {
          var popup = e.target.getPopup();
          var element = popup.getLatLng();
          console.log("this is the lat-lng element", element);
        }
        */

    // trigger google maps directions by userLocation
    $('#pollsMap').on('click', '.trigger', function() {
      var urlAddress = address.replace(/\s/g, '+');
      var urlName = placeName.replace(/\s/g, '+');
      //console.log("name", urlName, "address", urlAddress);
      var destination = urlName + '%2C+' +  urlAddress;
      //console.log(destination);
      var googleURL = "https://www.google.com/maps/dir/?api=1&origin&destination=" +  destination ;
      window.location = googleURL;
    });
});
