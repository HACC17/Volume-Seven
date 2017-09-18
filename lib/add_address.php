<?php

/*
 * add_address.php v0.1.0
 *
 *
 * VOLUNTEER REGISTRATION AND SCHEDULER WEB APP
 * Developed by team VOLUME 7 as a demo for HACC17
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

/*   vars =  "volID=" + sessionStorage.v7userID +
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
*/


// CLEAR VARIABLES
$volID = $address1 = $address2 = $city = $state = $zipCode = "";
$addressM1 = $addressM2 = $cityM = $stateM = $zipCodeM = "";

// CHECK THAT VARIABLES ARE POSTED (VALIDATE BY JS in production version) OR EXIT
if ( empty($_POST['volID']) ) {
	exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $volID = $_POST['volID'];
  $address1 = $_POST['address1'];
	$address2 = $_POST['address2'];
  $city = $_POST['city'];
	$state = $_POST['state'];
	$zipCode = $_POST['zipCode'];

	$addressM1 = $_POST['addressM1'];
	$addressM2 = $_POST['addressM2'];
	$cityM = $_POST['cityM'];
	$stateM = $_POST['stateM'];
	$zipCodeM = $_POST['zipCodeM'];


	// CLEAN POSTVARIABLES
	$volID = clean_input($volID);
	$address1 = clean_input($address1);
	$address2 = clean_input($address2);
	$city = clean_input($city);
	$state = clean_input($state);
	$zipCode = clean_input($zipCode);

	$addressM1 = clean_input($addressM1);
	$addressM2 = clean_input($addressM2);
	$cityM = clean_input($cityM);
	$stateM = clean_input($stateM);
	$zipCodeM = clean_input($zipCodeM);

  } else {
  exit();
}

// CLEAN INPUT FUNCTION
function clean_input($data) {
   $data = trim($data);
   $data = stripslashes($data);
   $data = mysql_escape_string($data);
   return $data;
}

// DBASE CONFIGS
require_once '../../../../config.php';

// CREATE CONNECTION
$con = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// CHECK CONNECTION
if (mysqli_connect_errno()) {
	$queryresult = "ERROR CONN FAIL";
}

// SQL Query ADD ADDRESS
$residence_address = "INSERT INTO address (volID, addrType, address1, address2, city, state, zipCode) VALUES ('$volID', 'R', '$address1', '$address2', '$city', '$state', '$zipCode') ";

// SEND QUERY AND EVALUATE RESULT
if ($con->query($residence_address) === TRUE) {
	$queryresult = "OK";

	$mail_address = "INSERT INTO address (volID, addrType, address1, address2, city, state, zipCode) VALUES ('$volID', 'M', '$addressM1', '$addressM2', '$cityM', '$stateM', '$zipCodeM') ";

	if ($con->query($mail_address) === TRUE) {
		$queryresult = "OK";
		} else {
			$queryresult = mysqli_error($con);
		}
  } else {
	$queryresult = mysqli_error($con);
}

// CLOSE CONNECTION
mysqli_close($con);

// ADD QUERY RESULT TO ARRAY
$data["result"] = $queryresult;

// RETURN ARRAY AS JSON
header('Content-type: application/json');
echo json_encode( $data );

?>
