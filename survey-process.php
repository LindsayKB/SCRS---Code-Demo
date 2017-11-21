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
  <div class="two columns">&nbsp;</div>
  <div class="eight columns"><center><h1>SCRS</h1></center></div>
  <div class="two columns">&nbsp;</div>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns">
<?php
if (isset($_POST['submit-pg1'])) {
					  $clientname = $_POST['clientname'];
                       // No password confirmation required, otherwise $passconf = protect($_REQUEST['passconf']);
                      $date = $_POST['date'];
					  $therapist = $_POST['therapist'];
					  $clientemail = $_POST['clientemail'];
					  $parts = explode(" ",$clientname);
					  $clientLast = array_pop($parts);
					  $clientFirst = implode(" ", $parts);
					  /* $therapistParts = explode(" ",$therapist);
					  $therapistLast = array_pop($therapistParts);
					  $therapistFirst = implode(" ", $therapistParts); */
					  $SQL = "SELECT * FROM therapists WHERE email = '$therapist'";
					  $result = mysql_query($SQL);
					  while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
						  $therapistFirst = $row['firstname'];
						  $therapistLast = $row['lastname'];
					  }
					  $sessionID = uniqid();
					  $SQL = "SELECT * FROM clients WHERE clientFirst = '$clientFirst' AND clientLast = '$clientLast' AND therapist = '$userEmail'";
					  $result = mysql_query($SQL);
					  $num_rows = mysql_num_rows($result);
					  if ($num_rows > 0)
					  {
						  //Do nothing
					  }
					  else
					  {
						  $SQL = "INSERT INTO clients (firstname, lastname, email, therapist) VALUES ($clientFirst, $clientLast, $clientemail, $userEmail)";
						   $result = mysql_query($SQL);
					  }
					  if (!$clientname || !$date || !$therapist) {
							echo "<br><br><center>You need to fill in all of the required fields!</center>";
							echo '<br><br><center><a href="http://scrs-test.comli.com/survey.php"><button type="button" id="back">Go back to Login</button></a></center>';
						}
					  else
					  {
						  $_SESSION['clientLast'] = $clientLast;
						  $_SESSION['clientFirst'] = $clientFirst;
						  $_SESSION['therapistLast'] = $therapistLast;
						  $_SESSION['therapistFirst'] = $therapistFirst;
						  $_SESSION['date'] = $date;
						  $_SESSION['ID'] = $sessionID;
						  $SQL = "SELECT firstname, lastname, email, therapist FROM clients WHERE VALUES firstname = '".$clientFirst."' AND lastname = '".$clientLast."' AND email = '".$clientemail."' AND therapist = '".$userEmail."'";	  
						  $res = mysql_query($SQL);
						  $num_rows = mysql_num_rows($res);
						  if ($num_rows > 0)
						  {
							  //Do not add and move to next page
						  }
						  else
						  {
							  //Add to database
							  $SQL = "INSERT INTO clients (firstname, lastname, email, therapist) VALUES ('".$clientFirst."','".$clientLast."','".$clientemail."','".$userEmail."')";
							  $res = mysql_query($SQL);
						  }
						  header('Location: survey-pg2.php');
					  }
				 }
elseif (isset($_POST['submit-pg2'])) {
	$relationships = $_POST['relationships'];
	$arr = explode("\n", $relationships);
	$newArray = array_filter($arr);
   $_SESSION['listOfRelationships'] = $newArray;
	$result = count($newArray);
	$_SESSION['resultNum'] = $result; //Total
	$_SESSION['count'] = 0;
	if ($result > 40)
	{
		echo "<br><br><center>You entered too many people.</center>";
		echo '<br><br><center><a href="http://scrs-test.comli.com/survey-pg2.php"><button type="button" id="back">Go Back</button></a></center>';
	}
	else
	{
		header('Location: survey-pg3.php');
	}
	//var_dump($arr);
	//header('Location: survey-pg3.php');
}
?>
    </div>
  <div class="two columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
