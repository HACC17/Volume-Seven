/*!
 * index.js JavaSctipt v0.1.3
 *
 *
 * VOLUNTEER REGISTRATION AND SCHEDULER WEB APP
 * Developed by team VOLUME 7 as a demo for HACC17
 *
 * Copyright 2017 Spencer Young, Holger H-Ray Heine
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


// DECLARE VARS
var currentForm;

// DOCUMENT READY FUNCTIONS AND TRANSITIONS
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

    // SET CHECKBOX MAILING = RESIDENCE ADDRESS TO CHECKED
    $('#mailingSameAsResidence').prop('checked', true);

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

    // WRITE RESIDENCE ADDRESS INPUT TO SESSION STORAGE
    sessionStorage.v7residenceAddress1 = document.getElementById("residenceAddress1").value;
    sessionStorage.v7residenceAddress2 = document.getElementById("residenceAddress2").value;
    sessionStorage.v7residenceCity = document.getElementById("residenceCity").value;
    sessionStorage.v7residenceState = document.getElementById("residenceState").value;
    sessionStorage.v7residenceZipCode = document.getElementById("residenceZipCode").value;

    // CHECK ON MAILING ADDRESS = RESIDENCE ADDRESS BOX STATUS
    if($("#mailingSameAsResidence").is(':checked')) {

      console.log("mailing same as residence box is checked");

      // WRITE MAILING ADDRESS INPUT TO SESSION STORAGE
      sessionStorage.v7mailingAddress1 = sessionStorage.v7residenceAddress1;
      sessionStorage.v7mailingAddress2 = sessionStorage.v7residenceAddress2;
      sessionStorage.v7mailingCity = sessionStorage.v7residenceCity;
      sessionStorage.v7mailingState = sessionStorage.v7residenceState;
      sessionStorage.v7mailingZipCode = sessionStorage.v7residenceZipCode;

      } else {

      console.log("mailing same as residence box is NOT checked");

      // WRITE MAILING ADDRESS INPUT TO SESSION STORAGE
      sessionStorage.v7mailingAddress1 = document.getElementById("mailingAddress1").value;
      sessionStorage.v7mailingAddress2 = document.getElementById("mailingAddress2").value;
      sessionStorage.v7mailingCity = document.getElementById("mailingCity").value;
      sessionStorage.v7mailingState = document.getElementById("mailingState").value;
      sessionStorage.v7mailingZipCode = document.getElementById("mailingZipCode").value;

    }

    // WRITE USER ADDRESS INPUT TO MYSQL
    add_address();

    });




  $('#mailingSameAsResidence').click(function() {
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
  });
});

$('#donateStipiend').click(function() {
  if (this.checked) {
    $('#npoInputFields').removeClass('hideForm');
  } else if (!this.checked) {
    $('#npoInputFields').addClass('hideForm');

  }
});

// DBASE FUNCTIONS

function create_account() {
    "use strict";
    console.log("create account called")

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


function add_address(){
  // WRITE NAME DATA TO MYSQL
  "use strict";
  var hr = new XMLHttpRequest(),
  url = "lib/add_address.php",
  vars =  "volID=" + sessionStorage.v7userID +
          "&address1=" + sessionStorage.v7residenceAddress1 +
          "&address2=" + sessionStorage.v7residenceAddress2 +
          "&city=" + sessionStorage.v7residenceCity +
          "&state=" + sessionStorage.v7residenceState +
          "&zipCode=" + sessionStorage.v7residenceZipCode +
          "&addressM1=" + sessionStorage.v7mailingAddress1 +
          "&addressM2=" + sessionStorage.v7mailingAddress2 +
          "&cityM=" + sessionStorage.v7mailingCity +
          "&stateM=" + sessionStorage.v7mailingState +
          "&zipCodeM=" + sessionStorage.v7mailingZipCode;

  hr.open("POST", url, true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.onreadystatechange = function (){
    if (hr.readyState === 4 && hr.status === 200){
      var data = JSON.parse(hr.responseText);
      if(data.result != "OK") {
        // SOMETHING WENT WRONG
        console.log("Error: " + data.result);
      } else {
        console.log("Volunteer Address Info written to db.");
      }
    }
  };
  hr.send(vars);
  console.log("vars sent: " + vars);
}



function other_info(){
  // WRITE NAME DATA TO MYSQL
  "use strict";

  // WRITE OTHER INFO INPUT TO SESSION STORAGE
  sessionStorage.v7secondLanguage = document.getElementById("secondLanguage").value;
  sessionStorage.v7politicalPartyAffiliation = document.getElementById("politicalPartyAffiliation").value;
  sessionStorage.v7isStateEmployee = document.getElementById("isStateEmployee").value;
  sessionStorage.v7workedInElection = document.getElementById("workedInElection").value;
  sessionStorage.v7lastElectionWorked = document.getElementById("lastElectionWorked").value;

  sessionStorage.v7lastElectionPosition = document.getElementById("lastElectionPosition").value;
  sessionStorage.v7donateStipiend = document.getElementById("donateStipiend").value;
  sessionStorage.v7NPO = document.getElementById("NPO").value;

  console.log("politicalPartyAffiliation: " + sessionStorage.v7politicalPartyAffiliation);
  console.log("donateStipiend: " + sessionStorage.v7donateStipiend);
  console.log("NPO: " + sessionStorage.v7NPO);


/*
  var hr = new XMLHttpRequest(),
  url = "lib/add_other_info.php",
  vars =  "volID=" + sessionStorage.v7userID +
          "&address1=" + sessionStorage.v7residenceAddress1 +
          "&address2=" + sessionStorage.v7residenceAddress2 +
          "&city=" + sessionStorage.v7residenceCity +
          "&state=" + sessionStorage.v7residenceState +
          "&zipCode=" + sessionStorage.v7residenceZipCode +
          "&addressM1=" + sessionStorage.v7mailingAddress1 +
          "&addressM2=" + sessionStorage.v7mailingAddress2 +
          "&cityM=" + sessionStorage.v7mailingCity +
          "&stateM=" + sessionStorage.v7mailingState +
          "&zipCodeM=" + sessionStorage.v7mailingZipCode;

  hr.open("POST", url, true);
  hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  hr.onreadystatechange = function (){
    if (hr.readyState === 4 && hr.status === 200){
      var data = JSON.parse(hr.responseText);
      if(data.result != "OK") {
        // SOMETHING WENT WRONG
        console.log("Error: " + data.result);
      } else {
        console.log("Volunteer Other Info written to db.");
      }
    }
  };
  hr.send(vars);
  console.log("vars sent: " + vars);
*/

// REDIRECT TO TRAINING SIGNUP
window.location.assign("job.html");

}
