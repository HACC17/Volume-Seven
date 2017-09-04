/*!
 * reg02.js JavaSctipt v0.0.1
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

//var userName = sessionStorage.v7userName;

//console.log("userName: " + sessionStorage.v7userName);


 if(sessionStorage.v7userStatus == "0"){
   var emailStatus = "unconfirmed";
 }


//var userName = sessionStorage.v7_userName;

 // DISPLAY RETRIEVED SQL USER DATA
 document.getElementById("userID").innerHTML = sessionStorage.v7userID;
 document.getElementById("userName").innerHTML = sessionStorage.v7userName;
 document.getElementById("userName2").innerHTML = sessionStorage.v7userName;
 document.getElementById("userEmail").innerHTML = sessionStorage.v7userEmail;
 document.getElementById("userStatus").innerHTML = emailStatus;
 document.getElementById("userCreated").innerHTML = sessionStorage.v7userCreated;

 //document.getElementById("userName").innerHTML = sessionStorage.v7userName;
