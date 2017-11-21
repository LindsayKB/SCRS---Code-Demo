<?php
session_start();
//connect to the database so we can check, edit, or insert data to our users table
include("dbconfig.php");

if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) {

header ("Location: index.php");

}

$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());
$clientID = $_GET["clientid"];
	$person = $_GET['person'];
	$oldName = $_GET['oldName'];
	$userEmail = $_SESSION['email'];
$ID = $_SESSION['ID'];
$firstname = $_SESSION['firstname'];

if (!$con) {
    die('Could not connect: ' . mysql_error($con));
}
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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
  <!-- Functions for Edit Page -->

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
  <div class="one columns">&nbsp;</div>
  <div class="ten columns">
	<div class="container">
		<div class="row">
			<div class="twelve columns">
    		<!-- Edit Header -->
			<h2>Edit Name of Client</h2>
			<?php
			echo $clientID;
		   $query = mysql_query("SELECT id, firstname, lastname FROM clients WHERE id = '". $clientID ."' AND therapist = '" . $userEmail . "'");
           //$result = mysql_query($query);
		   while($row1 = mysql_fetch_array($query))
		   {
			    $clientFirst = $row1['firstname'];
				$clientLast = $row1['lastname'];
		   }
		?>
		<div class="edit">
		   <form action="<?=$_SERVER['PHP_SELF'];?>" method="post">
 <input type="hidden" name="id" value="<?php echo $clientId; ?>"/>
 <div>
 <strong>First Name: *</strong> <input type="text" name="formFirstname" value="<?php echo $clientFirst ?>"/><br/>
 <strong>Last Name: *</strong> <input type="text" name="formLastname" value="<?php echo $clientLast ?>"/><br/>
 <p>* Required</p>
 <input type="submit" name="submit" value="Submit">
 </div>
 </form> 

		</div>
			
			</div>
		</div>
	</div>
 </div>
  <div class="one columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>


<?php 
// mysqli_select_db($con,"ajax_demo");
/* $sql="SELECT * FROM clients WHERE therapist = '" . $userEmail ."' AND (firstname = '" . $oldName . "' OR lastname = '" . $oldName . "')";
$result = mysql_query($sql) or die(mysql_error());

while($row = mysql_fetch_array($result) or die(mysql_error())) {
	if ($row['firstname'] = $oldName)
	{
		$sql = "UPDATE clients SET firstname='".$person."' WHERE firstname='".$row['firstname']."' AND therapist='".$userEmail."'";
		$res = mysql_query($SQL);
		$result = "First name replaced.";
	}
	else if ($row['lastname'] = $oldName)
	{
		//Replace
		$sql = "UPDATE clients SET firstname='".$person."' WHERE lastname='".$row['lastname']."' AND therapist='".$userEmail."'";
		$res = mysql_query($SQL);
		$result = "Last name replaced.";
	}
	else
	{
		//Do nothing
	}

}
	echo $result;
exit();
mysql_close($con) */
?>
