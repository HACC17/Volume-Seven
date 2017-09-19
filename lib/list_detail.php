<?php

/*
 * list_detail.php v0.1.0
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

// admin-detail.js: vars = "userID=" + getUserID;



// CLEAR VARIABLES
$userID = "";

// CHECK THAT VARIABLES ARE POSTED (VALIDATE BY JS in production version) OR EXIT
if ( empty($_POST['userID']) ) {
	exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $userID = $_POST['userID'];
  } else {
  exit();
}



// DBASE CONFIGS
require_once '../../../../config.php';

// CREATE CONNECTION
$con = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// CHECK CONNECTION
if (mysqli_connect_errno()) {
	$queryresult = "ERROR CONN FAIL";
}


$query = "SELECT volname.firstName, volname.middleName, volname.lastName, volname.aKa, volunteers.userID, volunteers.userEmail
FROM volname INNER JOIN volunteers ON volname.volID = volunteers.userID WHERE volunteers.userID = '$userID' ";

$docs = $con->query($query);
$row_docs_cnt = $docs->num_rows;
if($row_docs_cnt > 0) {
    $userDocs = array();
        while($doc = $docs->fetch_assoc()){
        	$userDocs[] = $doc;
        	}
    } else {
    $userDocs[0] = array("result"=>"noDocs");
    }



// CLOSE CONNECTION
mysqli_close($con);

// RETURN ARRAY AS JSON
header('Content-type: application/json');
echo json_encode( $userDocs );

?>
