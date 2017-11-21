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

//Get number of entries
//Start while loop
//Insert ID number and increment by 1 each time

$result = mysql_query("SELECT COUNT(*) AS countNum FROM results");
while ($row = mysql_fetch_array($result)) {
    $countNum = $row['countNum'];
}
echo $countNum;
$idNum = 0;
echo $idNum;
for ($idNum = 0; $idNum <= $countNum; $idNum++)
{
	$sql1 = "SELECT * FROM results";
	$result = mysql_query($sql1);
	while (mysql_fetch_array($result))
	{
		$sql2 = "UPDATE results SET id = $idNum";
		$result2 = mysql_query($sql2);
		echo $idNum;
	}		
}
echo "Total Updated: $idNum"; 

?>
		