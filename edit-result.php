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
			<?php
			if (isset($_POST['edit-name'])) {
				$clientID = $_POST['id'];
				echo $clientID;
				$formFirstName = $_POST['formFirstname'];
				echo $formFirstName;
				$formLastName = $_POST['formLastname'];
				echo $formLastName;
				$SQL = "UPDATE clients SET firstname = '".$formFirstName."', lastname = '".$formLastName."' WHERE id = '". $clientID ."'";
				$query = mysql_query($SQL);
				echo $SQL;
				$pageContent = "The name has been changed!<br><br><a href='/edit.php'><button>BACK TO EDIT</button></a>";
			}
			elseif (isset($_POST['add-relationship'])) {
$relationName = $_POST['relationName'];
 $relationshipType = $_POST['relationshipType'];
$clientFirst = $_POST['clientFirst'];
	$clientLast = $_POST['clientLast'];
	$therapistFirst = $_POST['therapistFirst'];
	$therapistLast = $_POST['therapistLast'];
$clientID = $_POST['clientID'];
	$close = $_POST['close'];
	$influence = $_POST['influence'];
	$likeability = $_POST['likeability'];
	$effect = $_POST['effect'];
	$known = $_POST['known'];
	$interact = $_POST['interact'];
	$comments = $_POST['comments'];
	$distance = ($close * 3) + 1;
	$group = ($close - 1) * 3 + 4 - $likeability;
	if ($relationType == 'Deceased Relative')
	{
		$deceased = 'y';
	}
	else
	{
		$deceased = 'n';
	}
	if (($relationshipType == "choose") || ($close == "choose") || ($influence == "choose") || ($likeability == "choose") || ($effect == "choose") || ($known == "choose") || ($interact == "choose") || ($comments == "choose"))
	{
		//DO NOT SUBMIT
		//Show pop up instead
		echo "<script type='text/javascript'>alert('Please fill out all fields!')</script>";
	}
	else
	{
		$SQL = "INSERT INTO results (clientFirst, clientLast, therapistFirst, therapistLast, relationName, relationshipType, close, influence, likeability, effect, known, interact, distance, groupNum, comment, date, sessionID, curDate, deceased) VALUES ('".$clientFirst."','".$clientLast."','".$therapistFirst."','".$therapistLast."','".$relationName."','".$relationshipType."','".$close."','".$influence."','".$likeability."','".$effect."','".$known."','".$interact."','".$distance."','".$group."','".$comments."','".$date."','".$ID."','".$curDate."','".$deceased."')";
	$res = mysql_query($SQL);
$pageContent = "You have added a relationship. Would you like to add another?<br><br>
<form action='edit-process.php' method='post'>
<input type='hidden' name='firstname' value='$clientFirst' >
<input type='hidden' name='lastname' value='$clientLast' >
<input type='hidden' name='clientID' value='$clientID' >
<div class='container'>
<div class='row'>
<div class='twelve columns'>
</div>
</div>
<div class='row'>
<div class='six columns'>
<input type='submit' name='delete' value='ADD ANOTHER' id='delete' />
</div>
<div class='six columns'>
<input type='submit' name='back' value='BACK TO EDIT' id='back' />
</div>
</div>
</div>
</form>";
	}
			}
			elseif (isset($_POST['delete'])) {
$clientFirst = $_POST['clientFirst'];
$clientLast = $_POST['clientLast'];
$relationName = $_POST['relationName'];
$clientID = $_POST['clientID'];
foreach($_POST['check_list'] as $relationName) {
	    $relationName = trim($relationName);
           $SQL = "DELETE FROM results WHERE clientFirst = '".$clientFirst."' AND clientLast = '".$clientLast."' AND relationName LIKE '%". $relationName ."%'"  or die(mysql_error()); 
	$res = mysql_query($SQL);
}

$pageContent = "You have deleted a relationship. Would you like to delete another?<br><br>
<form action='edit-process.php' method='post'>
<input type='hidden' name='firstname' value='$clientFirst' >
<input type='hidden' name='lastname' value='$clientLast' >
<input type='hidden' name='id' value='$clientID' >
<div class='container'>
<div class='row'>
<div class='twelve columns'>
</div>
</div>
<div class='row'>
<div class='six columns'>
<input type='submit' name='delete' value='DELETE ANOTHER' id='delete' />
</div>
<div class='six columns'>
<input type='submit' name='back' value='BACK TO EDIT' id='back' />
</div>
</div>
</div>
</form>";
			}
			elseif (isset($_POST['modifypg3'])) {
$clientFirst = $_POST['clientFirst'];
$clientLast = $_POST['clientLast'];
$relationName = $_POST['relationName'];
$clientID = $_POST['clientID'];
$relationID = $_POST['relationID'];
 $relationshipType = $_POST['relationshipType'];
	$close = $_POST['close'];
	$influence = $_POST['influence'];
	$likeability = $_POST['likeability'];
	$effect = $_POST['effect'];
	$known = $_POST['known'];
	$interact = $_POST['interact'];
	$comments = $_POST['comments'];
	if ($relationshipType == "Deceased Relative" || $interact == "Deceased")
	{
		$deceased = "y";
	}
	else
	{
		$deceased = "n";
	}
$SQL = "UPDATE results SET relationName='$relationName', relationshipType='$relationshipType', close='$close', influence='$influence', likeability='$likeability', effect='$effect', known='$known', interact='$interact', comment='$comments', deceased='$deceased', WHERE id = '$relationID'"  or die(mysql_error()); 
$res = mysql_query($SQL);

$pageContent = "You have modified the relationship. Would you like to modify another?<br><br>
<form action='edit-process.php' method='post'>
<input type='hidden' name='firstname' value='$clientFirst' >
<input type='hidden' name='lastname' value='$clientLast' >
<input type='hidden' name='id' value='$clientID' >
<div class='container'>
<div class='row'>
<div class='twelve columns'>
</div>
</div>
<div class='row'>
<div class='six columns'>
<input type='submit' name='modify' value='MODIFY ANOTHER' id='modify' />
</div>
<div class='six columns'>
<input type='submit' name='back' value='BACK TO EDIT' id='back' />
</div>
</div>
</div>
</form>";
			}
			?>
			<h2>Thank you!</h2>
			<div id="page-content"><?php echo $pageContent ?></div>
			
			</div>
		</div>
	</div>
 </div>
  <div class="one columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document-->
</body>
</html>