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
$clientLast = $_SESSION['clientLast'];
$clientFirst = $_SESSION['clientFirst'];
$therapistLast = $_SESSION['therapistLast'];
$therapistFirst = $_SESSION['therapistFirst'];
$date = $_SESSION['date'];
$ID = $_SESSION['ID'];
$result = $_SESSION['resultNum'];
$curDate = $_SESSION['date'];
$i = $_SESSION['count'];

//Send information to another page?

//SCORING SYSTEM
/*
	INFLUENCE	
	Weak - 1 (outer circle)
	Moderate - 2 (moderate circle)
	Strong - 3 (inner circle)
	
	Likeability
	Weak - 2000 (weakSize)
	Moderate - 4000 (moderateSize)
	Strong - 6000 (strongSize)
	
*/
$listOfRelationships = $_SESSION['listOfRelationships'];
if ($_SESSION['count'] == 0)
{
	$i = 0;
	$relationName = $listOfRelationships[$i];
}
else
{
	$i = $_SESSION['count'];
	$relationName = $listOfRelationships[$i];
}


if (isset($_POST['submit-pg3'])) {
	$relationshipType = $_POST['relationshipType'];
	$close = $_POST['close'];
	$influence = $_POST['influence'];
	$likeability = $_POST['likeability'];
	$effect = $_POST['effect'];
	$known = $_POST['known'];
	$interact = $_POST['interact'];
	$comments = $_POST['comments'];
	$displayName = $_POST['display-name'];
	$displayName = str_replace(" ", "", $displayName);
	$displayName = str_replace("", "", $displayName);
	$distance = ($close * 3) + 1;
	$group = ($close - 1) * 3 + 4 - $likeability;
	if ($relationType == 'Deceased Relative' || $interact == "Deceased")
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
else if ((strlen($displayName == 1)) || (strlen($displayName == 2)) || (strlen($displayName) > 6))
	{
		echo "<script type='text/javascript'>alert('Display name should be between 3-6 characters ')</script>";
	}
	else
	{
			if ($displayName == "")
			{
				$displayName = $relationName;
			}
			else
			{
				//Do nothing
			}
			$SQL = "INSERT INTO results (clientFirst, clientLast, therapistFirst, therapistLast, relationName, displayName, relationshipType, close, influence, likeability, effect, known, interact, distance, groupNum, comment, date, resultNum, sessionID, curDate, deceased) VALUES ('".$clientFirst."','".$clientLast."','".$therapistFirst."','".$therapistLast."','".$relationName."','".$displayName."','".$relationshipType."','".$close."','".$influence."','".$likeability."','".$effect."','".$known."','".$interact."','".$distance."','".$group."','".$comments."','".$date."','".$i."','".$ID."','".$curDate."','".$deceased."')";
		$res = mysql_query($SQL);
		$i++;
		$_SESSION['count'] = $i;
		if ($listOfRelationships[$i] != "")
		{
			echo "<meta http-equiv='refresh' content='0'>";
		}
		else
		{
			header ("Location: results.php");
		}
	}
	
	
	//Increment number
	//If the value is empty or null, go to results page
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
  <style>
     td
	 {
		 border-bottom:0px;
	 }
  </style>
  
  <!-- JavaScript
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <script type='text/javascript' src='/js/functions.js'></script>
  <script>
  function closeDescription()
  {
	  alert("Inner Circle\n\nVery close family and friends by your choice or people who you are in close association (such as co-workers or supervisors) by necessity.  They have your attention either by your choice or not, and whether the relationship is positive or negative.  For example – a loving parent, spouse, children, nosy neighbor, positive mentor, controlling boss.  They are a major focus for your time and resources.\n\nMiddleCircle\n\nNot as close as your inner circle but more than acquaintances.  Family and friends or co-workers and supervisor, pastor, etc., who have some influence on your life but are less of a focus than your primary group.  You may not interact with them for significant periods of time with little cost to the relationship.  For example – friends with whom you go out to eat occasionally, people with whom you volunteer on church projects, an old friend whom you don’t regularly see but with whom you talk often by phone and may see once a year, parents for whom you assist in caretaking but with whom you otherwise spend little time.\n\nOuter Circle\n\nHave little to no influence on your life and are of little relative importance and minor focus for your time and resources.  They can be acquaintances, relatives, co-workers with whom you have little interaction and can commonly ignore if you choose.  For example – a relative you see once a year at a reunion, a hairdresser,  a neighbor you greet regularly but never get to know, a worker at your office whom you know by occasional interaction but don’t work on the same projects or production line.");
	  }
  </script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
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
			<div class="twelve columns" id="formSurvey">
			<p>
<br>
<form method="post" action="">

	<table cellpadding="2" cellspacing="0" border="0" align="center">
			  		<tr>
				  		<td colspan="2" align="right">
						Who is <?php echo "$relationName?" ?>
						<br>
						<select name="relationshipType">
						<option value="choose">Choose One</option>
<option value="Spouse">Spouse</option>
<option value="Former Spouse">Former Spouse</option>
<option value="Partner">Partner/Lover</option>
<option value="Former Partner">Former Partner/Lover</option>
<option value="Parent">Parent</option>
<option value="StepParent">Stepparent</option>
<option value="Child">Child</option>
<option value="StepChild">Stepchild</option>
<option value="Sibling">Sibling</option>
<option value="Other Relative">Other Relative</option>
<option value="Deceased Relative">Deceased Relative</option>
<option value="Friend">Friend</option>
<option value="Neighbor">Neighbor</option>
<option value="Aquaintance">Aquaintance</option>
<option value="Coworker">Co-worker</option>
<option value="Boss">Boss/Supervisor</option>
<option value="Influence">Influence (someone you don't know personally but whose work has inluenced you, i.e. an author, artist or intellectual)</option>
<option value="Pet">Pet</option>
<option value="Other">Other (you may clarify in the comment area below)</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2" >If you would like a shorter display name for this person, please enter it below:
						<br><br>
						<input type="text" autocapitalize="off" class="users input1 required displayname" name="display-name" size="25"/></td>
  					</tr>
  					<tr>
  						<td align="right">How close are you (either by choice or necessity)?
						<br>
						<select name="close">
<option value="choose">Choose One</option>
<option value="1">Very Close, Inner Circle</option>
<option value="2">Moderately Close, Middle Circle</option>
<option value="3">Not Close, Outer Circle</option>
</select></td>
                      <td align="right">
					  <div onclick="closeDescription()"><button>Click for a complete description</button></div>
					  </td>
  					</tr>
					<tr>
  						<td colspan="2" >Rate the strength of the influence this person has over you. This includes both positive and negative influence.
						<br><br>
						<select name="influence">
<option value="choose">Choose One</option>
<option value="200000.00">Weak Influence</option>
<option value="300000.00">Moderate Influence</option>
<option value="400000.00">Strong Influence</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2" >Rate the likeability of this person.  This means how well you “click”, or how strong your affinity is for this person.  This may include your urge to be with and interact with this person.
						<br><br>
						<select name="likeability">
<option value="choose">Choose One</option>
<option value="1">Weak Affinity, Little to No Likeability</option>
<option value="2">Moderate Affinity, Likeable</option>
<option value="3">Strong Affinity, Most Likeable</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2" >Rate the effect this person has on your life.
						<br><br>
						<select name="effect">
<option value="choose">Choose One</option>
<option value="Extremely Negative Effect">Extremely Negative Effect</option>
<option value="Very Negative Effect">Very Negative Effect</option>
<option value="Negative Effect">Negative Effect</option>
<option value="Slightly Negative Effect">Slightly Negative Effect</option>
<option value="Neutral Effect">Neutral Effect</option>
<option value="Slightly Positive Effect">Slightly Positive Effect</option>
<option value="Positive Effect">Positive Effect</option>
<option value="Very Positive Effect">Very Positive Effect</option>
<option value="Extremely Positive Effect">Extremely Positive Effect</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2" >How long have you known this person?
						<br><br>
						<select name="known">
<option value="choose">Choose One</option>
<option value="Weeks">Weeks</option>
<option value="Months">Months</option>
<option value="One or Two Years">One or Two Years</option>
<option value="Two to Five Years">Two to Five Years</option>
<option value="Five to Ten Years">Five to Ten Years</option>
<option value="More than Ten Years">More than Ten Years</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2" >How often do you interact with this person
						<br><br>
						<select name="interact">
<option value="choose">Choose One</option>
<option value="Daily">Daily</option>
<option value="Weekly">Weekly</option>
<option value="Monthly">Monthly</option>
<option value="Yearly">Yearly</option>
<option value="Infrequently">Infrequently</option>
<option value="Former">Not Applicable - Former Relationship</option>
<option value="Deceased">Not Applicable - Deceased</option>
</select></td>
  					</tr>
					<tr>
  						<td colspan="2">Comment (Optional)<br>
You may use this area to write anything you want about this person.
						<br>
						<textarea name="comments" cols="50" rows="10" class="comments" id="comments"></textarea></td>
  					</tr>
  					<tr>
  						<td colspan="2" align="center">
                <input type="submit" name="submit-pg3" value="Continue" id="submit-pg3" />
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
