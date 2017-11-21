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
    		<form action="survey-process.php" method="post" autocomplete="off">
		  		<table cellpadding="2" cellspacing="0" border="0" align="center">
			  		<tr>
				  		<td>Client Name: </td>
					  	<td><input type="text" autocapitalize="off" class="users input1 required clientname" name="clientname" size="25"/></td>
  					</tr>
					<tr>
				  		<td>Email: </td>
					  	<td><input type="text" autocapitalize="off" class="users input1 required clientemail" name="clientemail" size="25"/></td>
  					</tr>
  					<tr>
  						<td>Date: </td>
  						<td><input type="date" class="users input1 required date" minlength="4" name="date" value=""/></td>
  					</tr>
					<tr>
  						<td>Therapist Email: </td>
  						<td><input type="text" class="users input1 required therapist" minlength="4" name="therapist" value=""/></td>
  					</tr>
  					<tr>
  						<td colspan="2" align="center">
                <input type="submit" name="submit-pg1" value="Continue" id="submit-pg1" />
              </td>
  					</tr>
  				</table>
  			</form>

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
