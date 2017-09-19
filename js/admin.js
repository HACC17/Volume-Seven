/*!
 * admin.js JavaSctipt v0.1.0
 *
 *
 * TEAM VOLUME 7 - VOLUNTEER REGISTRATION AND SCHEDULER WEB APP
 * Developed as a demo for HACC17
 *
 * Copyright 2017 Holger H-Ray Heine
 * contact: hh57@toposmedia.com
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
console.log("ready function");

listvols();

});


function listvols() {
    "use strict";
    console.log("listvols called");
    var hr = new XMLHttpRequest(),
        url = "lib/list.php",
        vars = "userName=admin";
    hr.open("POST", url, true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function (){
        if (hr.readyState === 4 && hr.status === 200){
            //$.mobile.loading( "hide" );
            var data = JSON.parse(hr.responseText);
            console.log(data);

            data.map((data) => {
              $(".usertable").append(`
                <tr class="${data.userID}">
                  <th scope="row">${data.userID}</th>
                  <td>${data.firstName}</td>
                  <td>${data.lastName}</td>
                  <td>${data.userEmail}</td>
                  <td>${data.userID}</td>
                  <td>Precinct Official</td>
                </tr>
                `);
            });

         }
    };

    hr.send(vars);
}
