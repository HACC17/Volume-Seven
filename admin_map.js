/**
* JS for admin map. simply displays poll locations on oahu
*
**/

$(document).ready(function() {
  // initiate map and set view above the oahu at zoom of 5
  var adminMap = L.map('adminViewPolls').setView([21.438912, -158.000057], 13);




    // set base map layer to streets
    L.esri.basemapLayer('Streets').addTo(adminMap);
    // get feature layer from honolulu gis map of poll stations
    // this might need to be changed to https?
    var polls = L.esri.featureLayer({
      url:'http://webserverholis.honolulugis.org/arcgis/rest/services/Public/Administrative_Political/MapServer/8'
    }).addTo(adminMap);

    var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

  var searchControl = L.esri.Geocoding.geosearch({
    providers: [
      arcgisOnline,
      L.esri.Geocoding.featureLayerProvider({
        url: 'http://webserverholis.honolulugis.org/arcgis/rest/services/Public/Administrative_Political/MapServer/8',
        searchFields: ['NAME', 'PRECINCTID'],
        label: 'Polling Locations',
        formatSuggestion: function(feature) {
          return feature.properties.NAME + ' - ' + feature.properties.PRECINCTID;
        }
      })
    ]
  }).addTo(adminMap);

  polls.on('click', function(evt) {
    console.log(evt.layer.feature.properties.NAME);

    // this could be used to query the database regarding locations to provide admin further information about the location
  });

});
