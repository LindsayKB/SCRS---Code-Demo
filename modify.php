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
$lastname = $_SESSION['lastname'];
if (!$con) {
    die('Could not connect: ' . mysql_error($con));
}
error_reporting(E_ALL);
ini_set( 'display_errors','1'); 
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
			if (isset($_POST['modifypg2'])) {
$pageTitle = "Modify Relationship";
                                $clientFirst = $_POST['clientFirst'];
				$clientID = $_POST['clientID'];
                                $clientLast = $_POST['clientLast'];
                                $relationName = $_POST['relationName'];
				
				$query = mysql_query("SELECT DISTINCT * FROM results WHERE clientFirst = '". $clientFirst ."' AND clientLast = '". $clientLast ."' AND therapistFirst = '" . $firstname . "' AND therapistLast = '" . $lastname . "' GROUP BY relationName");
				while($row1 = mysql_fetch_array($query))
				{
				$relationName = $row1['relationName'];
				$relationshipType = $row1['relationshipType'];
				$close = $row1['close'];
				$influence = $row1['influence'];
				$likeability = $row1['likeability'];
				$effect = $row1['effect'];
				$known = $row1['known'];
				$interact = $row1['interact'];
				$comment = $row1['comment'];
				$therapistComments = $row1['therapistComments'];
				$relationID = $row1['id'];
				}
  if (isset($comment))
{
  //Do nothing
}
else
{
  $comment = " ";
}
}
?>
<h2>Modify Relationship</h2>
<div id="page-content">
<form method='post' action='edit-result.php'>
	<table cellpadding='2' cellspacing='0' border='0' align='center'>
			  		<tr>
				  		<td colspan='2' align='right'>
<input type='hidden' name='clientFirst' value='$clientFirst'>
					<input type='hidden' name='clientLast' value='$clientLast'>
					<input type='hidden' name='clientID' value='$clientID'>
<input type='hidden' name='therapistFirst' value='$firstname'>
<input type='hidden' name='therapistLast' value='$lastname'>
<input type='hidden' name='relationID' id='relationID' value='<?php echo $relationID ?>'>
First Name: <input type='text' name='relationName' id='relationName' value='<?php echo $relationName ?>'>
						<br>
						What type of relationship is this?
						<select name='relationshipType'>
						<option value='choose'>Choose One</option>
<option value='Spouse' <?php if($relationshipType == 'Spouse') echo "selected='selected'" ?>>Spouse</option>
<option value='Former Spouse' <?php if($relationshipType=='Former Spouse') echo "selected='selected'"; ?>>Former Spouse</option>
<option value='Partner' <?php if($relationshipType=='Partner') echo "selected='selected'"; ?>>Partner/Lover</option>
<option value='Former Partner' <?php if($relationshipType=='Former Partner') echo "selected='selected'"; ?>>Former Partner/Lover</option>
<option value='Parent' <?php if($relationshipType=='Parent') echo "selected='selected'"; ?>>Parent</option>
<option value='StepParent' <?php if($relationshipType=='StepParent') echo "selected='selected'"; ?>>Stepparent</option>
<option value='Child' <?php if($relationshipType=='Child') echo "selected='selected'"; ?>>Child</option>
<option value='StepChild' <?php if($relationshipType=='StepChild') echo "selected='selected'"; ?>>Stepchild</option>
<option value='Sibling' <?php if($relationshipType=='Sibling') echo "selected='selected'"; ?>>Sibling</option>
<option value='Other Relative' <?php if($relationshipType=='Other Relative') echo "selected='selected'"; ?>>Other Relative</option>
<option value='Deceased Relative' <?php if($relationshipType=='Deceased Relative') echo "selected='selected'"; ?>>Deceased Relative</option>
<option value='Friend' <?php if($relationshipType=='Friend') echo "selected='selected'"; ?>>Friend</option>
<option value='Neighbor' <?php if($relationshipType=='Neighbor') echo "selected='selected'"; ?>>Neighbor</option>
<option value='Aquaintance' <?php if($relationshipType=='Aquaintance') echo "selected='selected'"; ?>>Aquaintance</option>
<option value='Coworker' <?php if($relationshipType=='Coworker') echo "selected='selected'"; ?>>Co-worker</option>
<option value='Boss' <?php if($relationshipType=='Friend') echo "selected='selected'"; ?>>Boss/Supervisor</option>
<option value='Influence' <?php if($relationshipType=='Influence') echo "selected='selected'"; ?>>Influence (someone you don't know personally but whose work has inluenced you, i.e. an author, artist or intellectual)</option>
<option value='Pet' <?php if($relationshipType=='Pet') echo "selected='selected'"; ?>>Pet</option>
<option value='Other' <?php if($relationshipType=='Other') echo "selected='selected'"; ?>>Other (you may clarify in the comment area below)</option>
</select></td>
  					</tr>
  					<tr>
  						<td align='right'>How close are you (either by choice or necessity)?
						<br>
						<select name='close'>
<option value='choose'>Choose One</option>
<option value='1' <?php if($close=='1') echo "selected='selected'"; ?>>Very Close, Inner Circle</option>
<option value='2' <?php if($close=='2') echo "selected='selected'"; ?>>Moderately Close, Middle Circle</option>
<option value='3' <?php if($close=='3') echo "selected='selected'"; ?>>Not Close, Outer Circle</option>
</select></td>
                      <td align='right'>
					  <div onclick='closeDescription()'><button>Click for a complete description</button></div>
					  </td>
  					</tr>
					<tr>
  						<td colspan='2' >Rate the strength of the influence this person has over you. This includes both positive and negative influence.
						<br><br>
						<select name='influence'>
<option value='choose'>Choose One</option>
<option value='200000.00' <?php if($influence=='200000.00') echo "selected='selected'"; ?>>Weak Influence</option>
<option value='300000.00' <?php if($influence=='300000.00') echo "selected='selected'"; ?>>Moderate Influence</option>
<option value='400000.00' <?php if($influence=='400000.00') echo "selected='selected'"; ?>>Strong Influence</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >Rate the likeability of this person.  This means how well you “click”, or how strong your affinity is for this person.  This may include your urge to be with and interact with this person.
						<br><br>
						<select name='likeability'>
<option value='choose'>Choose One</option>
<option value='1' <?php if($likeability=='1') echo "selected='selected'"; ?>>Weak Affinity, Little to No Likeability</option>
<option value='2' <?php if($likeability=='2') echo "selected='selected'"; ?>>Moderate Affinity, Likeable</option>
<option value='3' <?php if($likeability=='3') echo "selected='selected'"; ?>>Strong Affinity, Most Likeable</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >Rate the effect this person has on your life.
						<br><br>
						<select name='effect'>
<option value='choose'>Choose One</option>
<option value='Extremely Negative Effect' <?php if($effect=='Extremely Negative Effect') echo "selected='selected'"; ?>>Extremely Negative Effect</option>
<option value='Very Negative Effect' <?php if($effect=='Very Negative Effect') echo "selected='selected'"; ?>>Very Negative Effect</option>
<option value='Negative Effect'  <?php if($effect=='Negative Effect') echo "selected='selected'"; ?>>Negative Effect</option>
<option value='Slightly Negative Effect' <?php if($effect=='Slightly Negative Effect') echo "selected='selected'"; ?>>Slightly Negative Effect</option>
<option value='Neutral Effect' <?php if($effect=='Neutral Effect') echo "selected='selected'"; ?>>Neutral Effect</option>
<option value='Slightly Positive Effect' <?php if($effect=='Slightly Positive Effect') echo "selected='selected'"; ?>>Slightly Positive Effect</option>
<option value='Positive Effect' <?php if($effect=='Positive Effect') echo "selected='selected'"; ?>>Positive Effect</option>
<option value='Very Positive Effect' <?php if($effect=='Very Slightly Positive Effect') echo "selected='selected'"; ?>>Very Positive Effect</option>
<option value='Extremely Positive Effect' <?php if($effect=='Extremely Positive Effect') echo "selected='selected'"; ?>>Extremely Positive Effect</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >How long have you known this person?
						<br><br>
						<select name='known'>
<option value='choose'>Choose One</option>
<option value='Weeks' <?php if($known=='Weeks') echo "selected='selected'"; ?> >Weeks</option>
<option value='Months' <?php if($known=='Months') echo "selected='selected'"; ?>>Months</option>
<option value='One or Two Years' <?php if($known=='One or Two Years') echo "selected='selected'"; ?>>One or Two Years</option>
<option value='Two to Five Years' <?php if($known=='Two to Five Years') echo "selected='selected'"; ?>>Two to Five Years</option>
<option value='Five to Ten Years' <?php if($known=='Five to Ten Years') echo "selected='selected'"; ?>>Five to Ten Years</option>
<option value='More than Ten Years'  <?php if($known=='More than Ten Years') echo "selected='selected'"; ?>>More than Ten Years</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >How often do you interact with this person
						<br><br>
						<select name='interact'>
<option value='choose'>Choose One</option>
<option value='Daily' <?php if($interact=='Daily') echo "selected='selected'"; ?>>Daily</option>
<option value='Weekly' <?php if($interact=='Weekly') echo "selected='selected'"; ?>>Weekly</option>
<option value='Monthly' <?php if($interact=='Monthly') echo "selected='selected'"; ?>>Monthly</option>
<option value='Yearly' <?php if($interact=='Yearly') echo "selected='selected'"; ?>>Yearly</option>
<option value='Infrequently' <?php if($interact=='Infrequently') echo "selected='selected'"; ?>>Infrequently</option>
<option value='Former' <?php if($interact=='Former') echo "selected='selected'"; ?>>Not Applicable - Former Relationship</option>
<option value='Deceased' <?php if($interact=='Deceased') echo "selected='selected'"; ?>>Not Applicable - Deceased</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2'>Comment (Optional)<br>
You may use this area to write anything you want about this person.
						<br>
						<textarea name='comments' cols='50' rows='10' class='comments' id='comments'><?php echo $comment ?></textarea></td>
  					</tr>
  					<tr>
  						<td colspan='2' align='center'>
                <input type='submit' name='modifypg3' value='Continue' id='modifypg3' />
              </td>
  					</tr>
  				</table>
</form></div>
			
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
				