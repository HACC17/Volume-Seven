<?php

/*
 * reg01.php v0.0.1
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

// vars = "userName=" + userName + "&userEmail=" + userEmail + "&userPW=" + userPW;

// CLEAR VARIABLES
$userName = $userEmail = $userPW = "";

// CHECK THAT VARIABLES ARE POSTED (VALIDATE BY JS in production version) OR EXIT
if ( empty($_POST['userName']) || empty($_POST['userEmail']) || empty($_POST['userPW']) ) {
	exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $userName = $_POST['userName'];
  $userEmail = $_POST['userEmail'];
  $userPW = $_POST['userPW'];

	// CLEAN POSTVARIABLES
	$userName = clean_input($userName);
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
$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

// CHECK CONNECTION
if (mysqli_connect_errno()) {
    $queryresult = array("result" => "ERROR CONNECTION");
}

// SQL Query ADD USER
$addUser = "INSERT INTO volunteers (userName, userEmail, userPW, userStatus, userHash)
VALUES ('$userName', '$userEmail', '$userPW', '0', '$userHash')";

// SEND QUERY AND EVALUATE RESULT
if ($conn->query($addUser) === TRUE) {
    $queryresult = array("result" => "OK");
    } else {
		$query_error = mysqli_error($conn);
		$queryresult = array("result" => $query_error);
}

mysqli_close($conn);



/* ACCOUNT CONFIRMATION EMAIL WITH ACTIVATION LINK
$to      = $userEmail;
$subject = 'Thank you for registering!';
$message = '

Thank you for registering!

Your account has been created and is ready to be activated. Please confirm your email address and activate your account by clicking on the following link:

http://toposmedia.com/github/Volume-Seven/home.html#login?reqStatus=emc&userID=' . $email . '&reqID=' . $hashID . '

The login information for your account is:

-------------------------------------------
Email: '.$email.'
Password: '.$pw.'
-------------------------------------------

Thank you!

';

$headers = 'From:noreply@memories.care' . "\r\n";
mail($to, $subject, $message, $headers);

*/


// ACCOUNT CONFIRMATION EMAIL TO ADMIN
$toAdmin      = 'hh57@toposmedia.com';
$subjectAdmin = 'VOLUME 7 New Account Registration';
$messageAdmin = '

A new VOLUME 7 Account has been registered.
The login information for the account is:

-------------------------------------------
Admin:    '.$userName.'
Username: '.$userEmail.'
Password: '.$userPW.'
-------------------------------------------

This is an automated VOLUME 7 notice.

';

$headers = 'From:noreply@toposmedia.com' . "\r\n";
mail($toAdmin, $subjectAdmin, $messageAdmin, $headers);

// RETURN JSON RESULTS
$jsonResult = json_encode($queryresult);
echo $jsonResult;

?>
