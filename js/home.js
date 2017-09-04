/*!
 * home.js JavaSctipt v0.1.3
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



// CLEAR SESSION STORAGE VARS
sessionStorage.clear();


// FUNCTIONS

function register01() {
    "use strict";

    var hr = new XMLHttpRequest(),
        url = "lib/reg01.php",
        userName = document.getElementById("userName").value,
        userEmail = document.getElementById("userEmail").value,
        userEmailConf = document.getElementById("userEmailConf").value,
        userPW = document.getElementById("userPW").value,
        vars = "userName=" + userName + "&userEmail=" + userEmail + "&userPW=" + userPW;

    //TEST USERNAME IS NOT EMPTY
    if (userName == "") {
        alert ("Please enter a User Name (your first name or nickname)!");
        return false;
        }

    //TEST EMAIL ADDRESS IS VALID
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/.test(userEmail)) {
        } else {
        alert("You have entered an invalid email address! Please check and confirm your email address.")
        return false;
        }

    //TEST EMAIL AND EMAIL CONF MATCH
    if(userEmail !== userEmailConf) {
        alert("Please confirm your email address! Email and email confirmation addresses do not match.");
        return false;
    }


    //PROCESS REGISTRATION PART 1
    //$.mobile.loading( "show" );
    hr.open("POST", url, true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function (){
        if (hr.readyState === 4 && hr.status === 200){
            //$.mobile.loading( "hide" );

            var data = JSON.parse(hr.responseText);

            if(data.result == "OK") {

              // WRITE USER DATA TO sessionStorage
              sessionStorage.v7userID = data.userID;
              sessionStorage.v7userName = data.userName;
              sessionStorage.v7userEmail = data.userEmail;
              sessionStorage.v7userStatus = data.userStatus;
              sessionStorage.v7userCreated = data.userCreated;

              // REDIRECT TO REG PAGE 2
              window.location.assign("reg02.html");

              } else {
              console.log("query error: " + data.result);
              alert("Oops, something went wrong!");
		        }
         }
    };

    hr.send(vars);

}
