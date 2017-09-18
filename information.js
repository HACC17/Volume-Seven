
$( document ).ready(function() {
  $('#dateOfBirth').datepicker();
  let currentForm = 'personal-info';

  $('#personal-info-next').click((e) => {
    e.preventDefault();
    $('#personal-info').addClass('hideForm');
    $('#address-info').removeClass('hideForm');
    currentForm = 'address-info';
  });

  $('#address-info-next').click((e) => {
    e.preventDefault();
    $('#address-info').addClass('hideForm');
    $('#other-info').removeClass('hideForm');
    currentForm = 'other-info';
  });

  $('#mailingSameAsResidence').click(function(){
    if (this.checked) {
      $('#mailingAddressFields').addClass('hideForm');
    } else if (!this.checked) {
      $('#mailingAddressFields').removeClass('hideForm');
    }
  });

  $('#prefConMeth').change(function() {
    if (this.value === 'email') {
      $('#preferred-time-to-call-input').addClass('hideForm');
    } else if (this.value === 'phone') {
      $('#preferred-time-to-call-input').removeClass('hideForm');
    }

  // initiate invisivle map
  var map = L.map('queryPrecinctMap');



  // get feature layer from honolulu gis map of precincts
  var precincts = L.esri.featureLayer({
    url:'http://webserverholis.honolulugis.org/arcgis/rest/services/Public/Administrative_Political/MapServer/9',
  });

  //variables for functions
  var latlng;
  var precinctID;

  var residenceAddress = /*String value from form of the user's address*/

  // function used to geo-code user's address into lat-lng object
  function geoCodeAddress(address, fn) {
    L.esri.Geocoding.geocode().text(residenceAddress).run(function(err, results, response){
      console.log(results);
      fn(results);
    });
  }

  // function used to query precinct locations by lat-lng
  function precinctSite(precinct, fn){
    precincts.query().contains(latlng).run(function(error, featureCollection){
      //console.log(featureCollection.features[0].properties.PRECINCTID);
      fn(featureCollection.features[0].properties.PRECINCTID);
    });
  };



  geoCodeAddress("address", function(latLng) {
    //console.log("this is lat lng", latLng.results[0].latlng);
    latlng = L.latLng(latLng.results[0].latlng);

    precinctSite("precinct", function(location){
      //console.log("precinct id",location);
      precinctID = location;
      /*precinctID should be passed to the user database.Value can then be used to query poll locations*/
    });

  });

});
