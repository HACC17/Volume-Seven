/*!
 * map.js JavaSctipt v0.1.1
 *
 *
 * VOLUNTEER REGISTRATION AND SCHEDULER WEB APP
 * Developed by team VOLUME 7 as a demo for HACC17
 *
 * Copyright 2017 Charles Gum, Holger H-Ray Heine
 * contact: charlesgum@gmail.com, hh57@toposmedia.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, blend, trade,
 * bake, hack, scramble, difiburlate, digest and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



$(document).ready(function() {

  // initiate map and set view above the oahu at zoom of 5
  var map = L.map('pollsMap').setView([21.438912, -158.000057], 10);

    // set base map layer to streets
    L.esri.basemapLayer('Streets').addTo(map);
    // get feature layer from honolulu gis map of poll stations
    var polls = L.esri.featureLayer({
      url:'http://webserverholis.honolulugis.org/arcgis/rest/services/Public/Administrative_Political/MapServer/8'
    }).addTo(map);

        console.log("this is polls", polls);

    // user location variable currently set to string but should be changed to city of users location from the database
    var userLocation = 'Waianae';

    // wait for feature layer to load then run geocode to fit boundaries to user

    polls.once("load", function(evt) {

      L.esri.Geocoding.geocode().text(userLocation).run(function(err, response){

        map.fitBounds(response.results[0].bounds);
      });

    });


    // variables to generate directions parameters from feature layer property fields
    var address;
    var placeName;

    // Bind polls maerk to popup
    polls.bindPopup(function(layer) {
      placeName = layer.feature.properties.NAME;
      address = layer.feature.properties.ADDRESS;
      console.log('layer', layer.feature.properties);
      // inner html of properties available and other functionality
      return L.Util.template(
        '<h3>{NAME}</h3><p><b>{ADDRESS}</b><br>District:{DISTRICT}<br> Precinct:{PRECINCT}</p><br><button class="trigger btn btn-primary">Directions</button>',
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
      console.log("name", urlName, "address", urlAddress);
      var destination = urlName + '%2C+' +  urlAddress;
      console.log(destination);
      var googleURL = "https://www.google.com/maps/dir/?api=1&origin&destination=" +  destination ;
      window.location = googleURL;
    });
});
