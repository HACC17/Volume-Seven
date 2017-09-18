/*!
 * index.js JavaSctipt v0.1.3
 *
 *
 * VOLUNTEER REGISTRATION AND SCHEDULER WEB APP
 * Developed by team VOLUME 7 as a demo for HACC17
 *
 * Copyright 2017 Spencer Young, Holger H-Ray Heine
 * contact: spencerpjy@gmail.com, hh57@toposmedia.com
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


// DECLARE VARS
var currentForm;


// REGISTRATION FORM INDEX.HTML TRANSITIONS

$( document ).ready(function() {

  // INITIALIZE DATEPICKER
  var date_input=$('input[name="dateOfBirth"]'); //our date input has the name "date"
  var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
  var options={
    format: 'mm/dd/yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  };
  date_input.datepicker(options);

  // SET SCREEN ON LOAD
  currentForm = 'account_setup';

  $('#personal-info-next').click((e) => {
    e.preventDefault();
    $('#personal-info').addClass('hideForm');
    $('#address-info').removeClass('hideForm');
    currentForm = 'address-info';

    // WRITE USER INPUT TO SESSION STORAGE
    sessionStorage.v7firstName = document.getElementById("firstName").value;
    sessionStorage.v7middleName = document.getElementById("middleName").value;
    sessionStorage.v7lastName = document.getElementById("lastName").value;
    sessionStorage.v7aKa = document.getElementById("aKa").value;

    sessionStorage.v7dateOfBirth = document.getElementById("dateOfBirth").value;
    sessionStorage.v7cellPhone = document.getElementById("cellPhone").value;
    sessionStorage.v7homePhone = document.getElementById("homePhone").value;
    sessionStorage.v7prefConMeth = $('#prefConMeth input:radio:checked').val();

    console.log("date of birth: " + sessionStorage.v7dateOfBirth);
    console.log("preferred method of contact: " + sessionStorage.v7prefConMeth);

    // WRITE USER INPUT TO MYSQL
    add_info();

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

});




// FUNCTIONS

function create_account() {
    "use strict";

    var hr = new XMLHttpRequest(),
        url = "lib/create_account.php",
        userEmail = document.getElementById("userEmail").value,
        userEmailConf = document.getElementById("userEmailConf").value,
        userPW = document.getElementById("userPW").value,
        vars = "userEmail=" + userEmail + "&userPW=" + userPW;

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

    //TEST PW HAS BEEN ENTERED
    if(userPW == "") {
        alert("Please enter a password for your account.");
        return false;
    }


    //PROCESS ACCOUNT CREATION
    hr.open("POST", url, true);
    hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    hr.onreadystatechange = function (){
        if (hr.readyState === 4 && hr.status === 200){
            var data = JSON.parse(hr.responseText);
            if(data.result == "OK") {

              // WRITE USER DATA TO sessionStorage
              sessionStorage.v7userID = data.userID;
              sessionStorage.v7userEmail = data.userEmail;
              sessionStorage.v7userStatus = data.userStatus;
              sessionStorage.v7userCreated = data.userCreated;
              sessionStorage.v7userCC = data.userCC;

              console.log('userCC = ' + sessionStorage.v7userCC);

              document.getElementById("emailSub").innerHTML = sessionStorage.v7userEmail;

              $('#account-login').hide();
              $('#account_setup').addClass('hideForm');
              $('#confirm-email').removeClass('hideForm');
              currentForm = 'confirm-email';

              } else {
              console.log("query error: " + data.result);
              //if data.result begins with: "query error: Duplicate entry"
              //alert ("The email address " + userEmail + "belongs to an existing account. Please login with your password.");
              alert("Oops, something went wrong!");
		        }
         }
    };

    hr.send(vars);

}



function confirm_account(){
  "use strict";
  var userCCinput = document.getElementById("userCC").value;
  if(userCCinput == sessionStorage.v7userCC){

    // USER EMAIL CONFIRMED
    $('#confirm-email').addClass('hideForm');
    $('#personal-info').removeClass('hideForm');
    currentForm = 'personal-info';

    // UPDATE DBASE RECORD
    activate_account();

  } else {
    alert("Oops! The code you entered is incorrect. Please check carefully and try again.")
  }
}



function activate_account(){
  // ACTIVATE ACCOUNT
  "use strict";
  var hr = new XMLHttpRequest(),
  url = "lib/activate_acct.php",
  vars =  "volID=" + sessionStorage.v7userID;
  hr.open("POST", url, true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.onreadystatechange = function (){
    if (hr.readyState === 4 && hr.status === 200){
      var data = JSON.parse(hr.responseText);
      if(data.result != "OK") {
        // SOMETHING WENT WRONG
        console.log("Error: " + data.result);
      } else {
        console.log("Volunteer account activated.");
      }
    }
  };
  hr.send(vars);
  console.log("vars sent: " + vars);
}



function add_info(){
  // WRITE NAME DATA TO MYSQL
  "use strict";
  var hr = new XMLHttpRequest(),
  url = "lib/add_info.php",
  vars =  "volID=" + sessionStorage.v7userID +
          "&firstName=" + sessionStorage.v7firstName +
          "&middleName=" + sessionStorage.v7middleName +
          "&lastName=" + sessionStorage.v7lastName +
          "&aKa=" + sessionStorage.v7aKa +
          "&dateOfBirth=" + sessionStorage.v7dateOfBirth +
          "&cellPhone=" + sessionStorage.v7cellPhone +
          "&homePhone=" + sessionStorage.v7homePhone +
          "&prefConMeth=" + sessionStorage.v7prefConMeth;

  hr.open("POST", url, true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.onreadystatechange = function (){
    if (hr.readyState === 4 && hr.status === 200){
      var data = JSON.parse(hr.responseText);
      if(data.result != "OK") {
        // SOMETHING WENT WRONG
        console.log("Error: " + data.result);
      } else {
        console.log("Volunteer Name and Phone Info written to db.");
      }
    }
  };
  hr.send(vars);
  console.log("vars sent: " + vars);
}
