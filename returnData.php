<?php
session_start();
//connect to the database so we can check, edit, or insert data to our users table
include("dbconfig.php");

if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) {

header ("Location: index.php");

}

$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());
	$name = $_GET['name'];
	$userEmail = $_SESSION['email'];
$ID = $_SESSION['ID'];
$firstname = $_SESSION['firstname'];

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

// mysqli_select_db($con,"ajax_demo");
$sql="SELECT * FROM results WHERE sessionID = '".$ID."' AND displayName = '".$name."'";
$result = mysql_query($sql) or die(mysql_error());

while($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	$relationshipType = $row['relationshipType'];
	$relationName = $row['relationName'];
	$close = $row['close'];
	$influence = $row['influence'];
	$likeability = $row['likeability'];
	$effect = $row['effect'];
	$known = $row['known'];
	$interact = $row['interact'];
	$distance = $row['distance'];
	$comment = $row['comment'];
	$therapistComments = $row['therapistComments'];
	
	//Translate Closeness
	if ($close == "1")
	{
		$close = "Very Close, Inner Circle";
	}
	else if ($close == "2")
	{
		$close = "Moderately Close, Middle Circle";
	}
	
	else if ($close == "3")
	{
		$close = "Moderately Close, Middle Circle";
	}
	
	//Translate influence
	if ($influence == "200000.00")
	{
		$influence = "Weak Influence";
	}
	else if ($influence == "300000.00")
	{
		$influence = "Moderate Influence";
	}
	
	else if ($influence == "400000.00")
	{
		$influence = "Strong Influence";
	}
	
	//Translate likeability
	if ($likeability == "1")
	{
		$likeability = "Weak Affinity, Little to No Likeability";
	}
	else if ($likeability == "2")
	{
		$likeability = "Moderate Affinity, Likeable";
	}
	
	else if ($likeability == "3")
	{
		$likeability = "Strong Affinity, Most Likeable";
	}
}
$result = "$relationName \n$close\n$influence\n$likeability\n$effect\n$known\n$interact\n\nClient's Comments: $comment\n\nTherapist's Notes: $therapistComments";
	echo $result;
exit();
?>
