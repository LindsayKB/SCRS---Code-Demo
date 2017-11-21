<?php
session_start();
//connect to the database so we can check, edit, or insert data to our users table
include("dbconfig.php");

if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) {

header ("Location: index.php");

}

$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());

$userEmail = $_SESSION['email'];
$firstname = $_SESSION['firstname'];
$ID = $_SESSION['ID'];
$_SESSION['date'] = date('Y-m-d H:i:s');
$curDate = $_SESSION['date'];

?>
<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>SCRS</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">


  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/skeleton.css">
  <link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
  <script src="/js/functions.js" type="text/javascript"></script> 
  
  <!-- JavaScript
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <script type='text/javascript' src='/js/functions.js'></script>


</head>
<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
  <!--Header-->
  <div class="row header">
  <?php include("header.php"); ?>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns">
	<div class="container">
		<div class="row">
			<div class="twelve columns">
    <h1>Welcome!</h1>
	<br>
	<p>This app is based on a system developed by Denver Johnson. It is not a test of any sort but rather a tool to help both therapists and clients visualize the client's relalationship world.</p>

<p>Step one involves listing the people in your life.</p>

<p>Step two involves answering a few questions about each person on the list. Use the pull-down menus.</p>

<p>After completing the questionaire, the people in your life will be displayed as planets in your "solar system" with you at the center. The size of each planet indicates strength of influence. Distance from center signifies likability. Color represents impact.</p>
			</div>
		</div>
		<div class="row">
		  <div class="four columns">
		   <h4>Most Negative</h4>
		  </div>
		  <div class="four columns">
		   <h4>Neutral</h4>
		  </div>
		  <div class="four columns">
		   <h4>Most Positive</h4>
		  </div>
		</div>
		<div class="row">
		<div class="one columns"><div class="square black"></div></div>
		<div class="one columns"><div class="square dark-grey"></div></div>
		<div class="one columns"><div class="square medium-grey"></div></div>
		<div class="one columns"><div class="square light-grey"></div></div>
		<div class="one columns"><div class="square tan"></div></div>
		<div class="one columns"><div class="square blue"></div></div>
		<div class="one columns"><div class="square green"></div></div>
		<div class="one columns"><div class="square yellow"></div></div>
		<div class="one columns"><div class="square orange"></div></div>
		<div class="one columns"> &nbsp;</div>
	    <div class="one columns"> &nbsp;</div>
		<div class="one columns"> &nbsp;</div>
		</div>
		<div class="row">
		<div class="twelve columns">
		<br>
		<center>
		<a href="survey.php"><button>begin</button></a>
		</center>
		</div>
		</div>
	</div>
 </div>
  <div class="two columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
