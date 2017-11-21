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
$ID = $_SESSION['ID'];
$firstname = $_SESSION['firstname'];

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
  <?php include("header.php"); ?>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns">
    <center><h1>Your Archive</h1></center>
		<?php
		  //echo $userEmail;
		   $query = mysql_query("SELECT clientFirst, clientLast, date, sessionID FROM results WHERE therapistFirst = '" . $firstname . "'");
           //$result = mysql_query($query);
		   $table = "<table><tr><th>First Name</th><th>Last Name</th><th>Date</th></tr>";
		   while($row1 = mysql_fetch_array($query))
		   {
			   $date = date("m-d-Y",strtotime($row1['date']));
			    if($row1['clientFirst'] != '' && $row1['clientLast'] != '')
				{
					$table .="<tr>
                   <td>".$row1['clientFirst']."</td>
				   <td>".$row1['clientLast']."</td>
				   <td><a href='resultsArchive.php?id=".$row1['sessionID']."&clientfirst=".$row1['clientFirst']."&clientlast=".$row1['clientLast']."'>".$date."</a></td>
                    </tr>";
				}
		   }
		   $table .= "</table>";
		   echo $table;
		   
		   //Date takes person to results archive page w/ sessionID
		   //On results archive page, sessionID and first name are submitted. Results page acts as normal
		?>
	<br>
	<center><button onclick="goBack()">Go Back</button></center>
	
     </div>
  <div class="two columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
