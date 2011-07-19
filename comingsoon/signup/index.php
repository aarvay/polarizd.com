<?php

// Users signup will be added here.
$email = $_POST['email'];
$name = $_POST['name'];

include("is_email.php");
include("class.db.php"); // DAO class

$emailValidationStatus = is_email($email, true, true);

$db = new db("mysql:host=localhost;dbname=phoneapp","phoneappuser","easypass");

if($emailValidationStatus === ISEMAIL_VALID && !empty($name)) {
	$emailCounts = $db->select("invites", "email = :email", array(":email" => $email));
	
	// Is the user already in the queue?
	if(count($emailCounts) > 0) {
		// EMail already exist
		$result = array("type" => "message", "data" => "You've already signed up, We'll let you know, when we are live.");
		echo json_encode($result);
		die(); // or would return just do?
	}
	
	// Set up the data
	$insertData = array(
		"name" => $name,
		"email" => $email,
	);
	
	// Insert it!
	$db->insert("invites",$insertData);
	// Response message
	$result = array("type" => "message", "data" => "<h2>Thank you for signing up with us. We'll let you know, when we are live.</h2><br /><br /><br />", 'status' => true);
	echo json_encode($result);
} else {
	// Display the error message
	$error = "You seem to have entered an invalid email id. Please correct and try again.";
	$result = array("type" => "message", "data" => "<div style='color:red;'>$error</div>", "status" => false);
	echo json_encode($result);
}
