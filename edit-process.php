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
			if (isset($_POST['edit-name'])) {
				$pageTitle = "Edit Name";
				$clientID = $_POST['id'];
				$query = mysql_query("SELECT id, firstname, lastname FROM clients WHERE id = '". $clientID ."' AND therapist = '" . $userEmail . "'");
				while($row1 = mysql_fetch_array($query))
				{
			    $clientFirst = $row1['firstname'];
				$clientLast = $row1['lastname'];
				}
				$pageContent = "<div class='edit'>
		   <form action='edit-result.php' method='post'>
 <input type='hidden' name='id' value='$clientID'/>
 <div>
 <strong>First Name: *</strong> <input type='text' name='formFirstname' value='$clientFirst'/><br/>
 <strong>Last Name: *</strong> <input type='text' name='formLastname' value='$clientLast'/><br/>
 <p>* Required</p>
 <input type='submit' name='edit-name' value='Submit'>
 </div>
 </form></div>";
			}
			if (isset($_POST['add-relationship'])) {
$pageTitle = "Add Relationship";
$clientID = $_POST['id'];
$query = mysql_query("SELECT id, firstname, lastname FROM clients WHERE id = '". $clientID ."' AND therapist = '" . $userEmail . "'");
				while($row1 = mysql_fetch_array($query))
				{
			    $clientFirst = $row1['firstname'];
				$clientLast = $row1['lastname'];
				}
$pageContent = "<form method='post' action='edit-result.php'>

	<table cellpadding='2' cellspacing='0' border='0' align='center'>
			  		<tr>
				  		<td colspan='2' align='right'>
<input type='hidden' name='clientFirst' value='$clientFirst'>
<input type='hidden' name='clientLast' value='$clientLast'>
<input type='hidden' name='therapistFirst' value='$firstname'>
<input type='hidden' name='therapistLast' value='$lastname'>
<input type='hidden' name='clientID' value='$clientID'>
						First Name: <input type='text' name='relationName' id='relationName'>
						<br>
						What type of relationship is this?
						<select name='relationshipType'>
						<option value='choose'>Choose One</option>
<option value='Spouse'>Spouse</option>
<option value='Former Spouse'>Former Spouse</option>
<option value='Partner'>Partner/Lover</option>
<option value='Former Partner'>Former Partner/Lover</option>
<option value='Parent'>Parent</option>
<option value='StepParent'>Stepparent</option>
<option value='Child'>Child</option>
<option value='StepChild'>Stepchild</option>
<option value='Sibling'>Sibling</option>
<option value='Other Relative'>Other Relative</option>
<option value='Deceased Relative'>Deceased Relative</option>
<option value='Friend'>Friend</option>
<option value='Neighbor'>Neighbor</option>
<option value='Aquaintance'>Aquaintance</option>
<option value='Coworker'>Co-worker</option>
<option value='Boss'>Boss/Supervisor</option>
<option value='Influence'>Influence (someone you don't know personally but whose work has inluenced you, i.e. an author, artist or intellectual)</option>
<option value='Pet'>Pet</option>
<option value='Other'>Other (you may clarify in the comment area below)</option>
</select></td>
  					</tr>
  					<tr>
  						<td align='right'>How close are you (either by choice or necessity)?
						<br>
						<select name='close'>
<option value='choose'>Choose One</option>
<option value='1'>Very Close, Inner Circle</option>
<option value='2'>Moderately Close, Middle Circle</option>
<option value='3'>Not Close, Outer Circle</option>
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
<option value='200000.00'>Weak Influence</option>
<option value='300000.00'>Moderate Influence</option>
<option value='400000.00'>Strong Influence</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >Rate the likeability of this person.  This means how well you “click”, or how strong your affinity is for this person.  This may include your urge to be with and interact with this person.
						<br><br>
						<select name='likeability'>
<option value='choose'>Choose One</option>
<option value='1'>Weak Affinity, Little to No Likeability</option>
<option value='2'>Moderate Affinity, Likeable</option>
<option value='3'>Strong Affinity, Most Likeable</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >Rate the effect this person has on your life.
						<br><br>
						<select name='effect'>
<option value='choose'>Choose One</option>
<option value='Extremely Negative Effect'>Extremely Negative Effect</option>
<option value='Very Negative Effect'>Very Negative Effect</option>
<option value='Negative Effect'>Negative Effect</option>
<option value='Slightly Negative Effect'>Slightly Negative Effect</option>
<option value='Neutral Effect'>Neutral Effect</option>
<option value='Slightly Positive Effect'>Slightly Positive Effect</option>
<option value='Positive Effect'>Positive Effect</option>
<option value='Very Positive Effect'>Very Positive Effect</option>
<option value='Extremely Positive Effect'>Extremely Positive Effect</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >How long have you known this person?
						<br><br>
						<select name='known'>
<option value='choose'>Choose One</option>
<option value='Weeks'>Weeks</option>
<option value='Months'>Months</option>
<option value='One or Two Years'>One or Two Years</option>
<option value='Two to Five Years'>Two to Five Years</option>
<option value='Five to Ten Years'>Five to Ten Years</option>
<option value='More than Ten Years'>More than Ten Years</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2' >How often do you interact with this person
						<br><br>
						<select name='interact'>
<option value='choose'>Choose One</option>
<option value='Daily'>Daily</option>
<option value='Weekly'>Weekly</option>
<option value='Monthly'>Monthly</option>
<option value='Yearly'>Yearly</option>
<option value='Infrequently'>Infrequently</option>
<option value='Former'>Not Applicable - Former Relationship</option>
<option value='Deceased'>Not Applicable - Deceased</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan='2'>Comment (Optional)<br>
You may use this area to write anything you want about this person.
						<br>
						<textarea name='comments' cols='50' rows='10' class='comments' id='comments'></textarea></td>
  					</tr>
  					<tr>
  						<td colspan='2' align='center'>
                <input type='submit' name='add-relationship' value='Continue' id='add-relationship' />
              </td>
  					</tr>
  				</table>
 
</form>";
			} 
 if (isset($_POST['back'])) {
   header ("Location: edit.php");
} 
			if (isset($_POST['delete'])) {
				$pageTitle = "Delete Relationship";
				$clientID = $_POST['id'];
				
				$query = mysql_query("SELECT id, firstname, lastname FROM clients WHERE id = '". $clientID ."' AND therapist = '" . $userEmail . "'");
				while($row1 = mysql_fetch_array($query))
				{
			    $clientFirst = $row1['firstname'];
				$clientLast = $row1['lastname'];
				}
				$resultsTable = "<form method='post' action='edit-result.php'>";
				$resultsTable .= "<input type='hidden' name='clientFirst' value='$clientFirst'>
					<input type='hidden' name='clientLast' value='$clientLast'>
					<input type='hidden' name='clientID' value='$clientID'>";
				$resultsTable .= "<table>";
				$resultsTable .= "<tr><th></th><th>Name</th><th>Relationship</th><th>Closeness</th><th>Influence</th><th>Likeability</th><th>Effect</th><th>Years Known</th><th>Interaction Frequency</th><th>Your Comments</th><th>Therapist Comments</th></tr>";
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
					//Translate close	
					if ($close == 1)
					{
						$close = 'Very Close, Inner Circle';
					}
					else if ($close == 2)
					{
						$close = 'Moderately Close, Middle Circle';
					}
					else if ($close == 3)
					{
						$close = 'Not Close, Outer Circle';
					}
					//Translate influence
					if ($influence == 200000.00)
					{
						$influence = 'Weak Influence';
					}
					else if ($influence == 300000.00)
					{
						$influence = 'Moderate Influence';
					}
					else if ($influence == 400000.00)
					{
						$influence = 'Strong Influence';
					}
					//Translate likeability
					if ($likeability == 1)
					{
						$likeability = 'Weak Affinity, Little to No Likeability';
					}
					else if ($likeability == 2)
					{
						$likeability = 'Moderate Affinity, Likeable';
					}
					else if ($likeability == 3)
					{
						$likeability = 'Strong Affinity, Most Likeable';
					}
					$resultsTable .= "<tr><td><form method='post' action='edit-result.php'>
					<input type='checkbox' name='check_list[$relationName]'	value='$relationName'></td>
					<td>$relationName</td><td>$relationshipType</td><td>$close</td><td>$influence</td><td>$likeability</td><td>$effect</td><td>$known</td><td>$interact</td><td>$comment</td><td>$therapistComments</td></tr>";
				}
				$resultsTable .= "</table>";
				$resultsTable .= "<br>";
				$resultsTable .= "<input type='submit' name='delete' value='DELETE SELECTED' id='delete' /></form>";
				$pageContent = $resultsTable;
			} 
if (isset($_POST['modify'])) {
				$pageTitle = "Modify Relationship";
				$clientID = $_POST['id'];
				
				$query = mysql_query("SELECT id, firstname, lastname FROM clients WHERE id = '". $clientID ."' AND therapist = '" . $userEmail . "'");
				while($row1 = mysql_fetch_array($query))
				{
			    $clientFirst = $row1['firstname'];
				$clientLast = $row1['lastname'];
				}
				$resultsTable = "<table>";
				$resultsTable .= "<tr><th></th><th>Name</th><th>Relationship</th><th>Closeness</th><th>Influence</th><th>Likeability</th><th>Effect</th><th>Years Known</th><th>Interaction Frequency</th><th>Your Comments</th><th>Therapist Comments</th></tr>";
				$query = mysql_query("SELECT DISTINCT * FROM results WHERE clientFirst = '". $clientFirst ."' AND clientLast = '". $clientLast ."' AND therapistFirst = '" . $firstname . "' AND therapistLast = '" . $lastname . "' GROUP BY relationName");
				//echo "SELECT DISTINCT * FROM results WHERE clientFirst = '". $clientFirst ."' AND clientLast = '". $clientLast ."' AND therapistFirst = '" . $firstname . "' AND therapistLast = '" . $lastname . "' GROUP BY relationName";
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
					//Translate close	
					if ($close == 1)
					{
						$close = 'Very Close, Inner Circle';
					}
					else if ($close == 2)
					{
						$close = 'Moderately Close, Middle Circle';
					}
					else if ($close == 3)
					{
						$close = 'Not Close, Outer Circle';
					}
					//Translate influence
					if ($influence == 200000.00)
					{
						$influence = 'Weak Influence';
					}
					else if ($influence == 300000.00)
					{
						$influence = 'Moderate Influence';
					}
					else if ($influence == 400000.00)
					{
						$influence = 'Strong Influence';
					}
					//Translate likeability
					if ($likeability == 1)
					{
						$likeability = 'Weak Affinity, Little to No Likeability';
					}
					else if ($likeability == 2)
					{
						$likeability = 'Moderate Affinity, Likeable';
					}
					else if ($likeability == 3)
					{
						$likeability = 'Strong Affinity, Most Likeable';
					}
					$resultsTable .= "<tr><td><form method='post' action='modify.php'>
<input type='hidden' name='clientFirst' value='$clientFirst'>
					<input type='hidden' name='clientLast' value='$clientLast'>
					<input type='hidden' name='clientID' value='$clientID'>
<input type='hidden' name='relationName' value='$relationName'>
<input type='submit' name='modifypg2' value='MODIFY' id='modifypg2' /></form></td>
					<td>$relationName</td><td>$relationshipType</td><td>$close</td><td>$influence</td><td>$likeability</td><td>$effect</td><td>$known</td><td>$interact</td><td>$comment</td><td>$therapistComments</td></tr>";
				}
				$resultsTable .= "</table>";
				$pageContent = $resultsTable;
			} 
			?>
			<h2><?php echo $pageTitle ?></h2>
			<div id="page-content"><?php echo $pageContent ?></div>
			
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
	