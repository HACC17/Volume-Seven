/*!
 * admin-detail.js JavaSctipt v0.1.0
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

var getUserID;

$(document).ready(function() {
console.log("admin-detail.js ready function");


function goBack() {
    window.history.back();
}



function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

getUserID = getQueryVariable('id');
console.log("getUserID: " + getUserID);

volrecord();

});


function volrecord() {
    "use strict";
    console.log("volrecord called");
    var hr = new XMLHttpRequest(),
        url = "lib/list_detail.php",
        vars = "userID=" + getUserID;
    hr.open("POST", url, true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function (){
        if (hr.readyState === 4 && hr.status === 200){
            //$.mobile.loading( "hide" );
            console.log(hr.responseText);
            var data = JSON.parse(hr.responseText);

/*
            data.map((data) => {
              $(".usertable").append(`
                <tr class="${data.userID}">
                  <th scope="row"><a href="admin_detail.html?id=${data.userID}">${data.userID}</a></th>
                  <td>${data.firstName}</td>
                  <td>${data.lastName}</td>
                  <td>${data.userEmail}</td>
                  <td></td>

                  <td>Precinct Official</td>
                </tr>
                `);
            });
*/
         }
    };

    hr.send(vars);
    console.log(vars);
}
