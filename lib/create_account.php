<?php

/*
 * create_account.php v0.1.0
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

// home.js: vars = "userEmail=" + userEmail + "&userPW=" + userPW;



// CLEAR VARIABLES
$userEmail = $userPW = "";

// CHECK THAT VARIABLES ARE POSTED (VALIDATE BY JS in production version) OR EXIT
if ( empty($_POST['userEmail']) || empty($_POST['userPW']) ) {
	exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $userEmail = $_POST['userEmail'];
  $userPW = $_POST['userPW'];

	// CLEAN POSTVARIABLES
	$userEmail = clean_input($userEmail);
	$userPW = clean_input($userPW);
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

// GENERATE HASH FOR EMAIL CONFIRMATION
$userHash = md5(rand(0,1000));

// CREATE CONNECTION
$con = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// CHECK CONNECTION
if (mysqli_connect_errno()) {
	$queryresult = "ERROR CONN FAIL";
}

// SQL Query ADD USER
$addUser = "INSERT INTO volunteers (userEmail, userPW, userStatus, userHash)
VALUES ('$userEmail', '$userPW', '0', '$userHash')";

// SEND QUERY AND EVALUATE RESULT
if ($con->query($addUser) === TRUE) {
	$queryresult = "OK";
  $getUserData = "SELECT * FROM volunteers WHERE userEmail = '$userEmail' ";
  $results = $con->query($getUserData);
  $userData = $results->fetch_assoc();
  } else {
	$queryresult = mysqli_error($con);
}

// CLOSE CONNECTION
mysqli_close($con);

// GENERATE USER CC FROM HASH
$userCC = substr($userData['userHash'],0,6);
$userCC = strtoupper($userCC);


// ACCOUNT CONFIRMATION EMAIL WITH ACTIVATION LINK
$to      = $userEmail;
$subject = 'ELVOS 1.0: Thank you for registering!';
$message = '

Thank you for registering!

Your election volunteer account has been created and is ready to be activated.

Your ACTIVATON CODE IS:

	'.$userCC.'

Please enter the code exactly as listed above (case sensitive) to activate your account and continue with your registration.


The login information for your account is:
-------------------------------------------
Email:    '.$email.'
Password: '.$pw.'
-------------------------------------------

Thank you!

';

$headers = 'From:noreply@elvos.org' . "\r\n";
mail($to, $subject, $message, $headers);



// ACCOUNT CONFIRMATION EMAIL TO ADMIN
$toAdmin      = 'hh57@toposmedia.com';
$subjectAdmin = 'ELVOS 1.0 New Account Registration';
$messageAdmin = '

A new ELVOS 1.0 Account has been registered.
The login information for the account is:

-------------------------------------------
userEmail: '.$userEmail.'
userPW:    '.$userPW.'
userCC:    '.$userCC.'
-------------------------------------------

This is an automated ELVOS 1.0 notice.

';

$headers = 'From:noreply@elvos.org' . "\r\n";
mail($toAdmin, $subjectAdmin, $messageAdmin, $headers);

// ADD USER CC TO ARRAY
$userData["userCC"] = $userCC;

// ADD QUERY RESULT TO ARRAY
$userData["result"] = $queryresult;

// RETURN ARRAY AS JSON
header('Content-type: application/json');
echo json_encode( $userData );

?>
