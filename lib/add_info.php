<?php

/*
 * add_info.php v0.1.1
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

// index.js: vars =  "volID=" + sessionStorage.v7userID +
//            "&firstName=" + sessionStorage.v7firstName +
//            "&middleName=" + sessionStorage.v7middleName +
//            "&lastName=" + sessionStorage.v7lastName +
//            "&aKa=" + sessionStorage.v7aKa;
//						"&dateOfBirth=" + sessionStorage.v7dateOfBirth +
//						"&cellPhone=" + sessionStorage.v7cellPhone +
//						"&homePhone=" + sessionStorage.v7homePhone +
//						"&prefConMeth=" + sessionStorage.v7prefConMeth;


// CLEAR VARIABLES
$volID = $firstName = $middleName = $lastName = $aKa = "";
$dateOfBirth = $cellPhone = $homePhone = $prefConMeth = "";

// CHECK THAT VARIABLES ARE POSTED (VALIDATE BY JS in production version) OR EXIT
if ( empty($_POST['volID']) || empty($_POST['lastName']) ) {
	exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $volID = $_POST['volID'];
  $firstName = $_POST['firstName'];
	$middleName = $_POST['middleName'];
  $lastName = $_POST['lastName'];
	$aKa = $_POST['aKa'];

	$dateOfBirth = $_POST['dateOfBirth'];
	$cellPhone = $_POST['cellPhone'];
  $homePhone = $_POST['homePhone'];
	$prefConMeth = $_POST['prefConMeth'];

	// CLEAN POSTVARIABLES
	$volID = clean_input($volID);
	$firstName = clean_input($firstName);
	$middleName = clean_input($middleName);
	$lastName = clean_input($lastName);
	$aKa = clean_input($aKa);

	$dateOfBirth = clean_input($dateOfBirth);
	$cellPhone = clean_input($cellPhone);
	$homePhone = clean_input($homePhone);
	$prefConMeth = clean_input($prefConMeth);

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

// SQL Query ADD USER
$add_name_info = "INSERT INTO volname (volID, firstName, middleName, lastName, aKa) VALUES ('$volID', '$firstName', '$middleName', '$lastName', '$aKa') ";

// SEND QUERY AND EVALUATE RESULT
if ($con->query($add_name_info) === TRUE) {
	$queryresult = "OK";

	$add_phone_info = "INSERT INTO volinfo (volID, dob, cellPhone, homePhone, contactPref) VALUES ('$volID', '$dateOfBirth', '$cellPhone', '$homePhone', '$prefConMeth') ";
	if ($con->query($add_phone_info) === TRUE) {
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
