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
strtolower($userEmail);
$firstname = $_SESSION['firstname'];
$clientLast = $_SESSION['clientLast'];
$clientFirst = $_SESSION['clientFirst'];
$therapistLast = $_SESSION['therapistLast'];
$therapistFirst = $_SESSION['therapistFirst'];
$date = $_SESSION['date'];
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
<!-- <script type="text/javascript">
var num = 0;
document.querySelector('#num').innerHTML = num;
function process(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
        num++;
		document.querySelector('#num').innerHTML = num;
    }
}

</script> -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
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
			<br>
			<p>List 30 to 40 people in your life (nuclear family, relatives, friends, co-workers, neighbors, acquaintances, etc.) with whom you have a relationship and with whom you interact at least occasionally.</p>

<p>You may include someone with whom you had a significant relationship in the past (such as a former friend or deceased loved one, even an author, artist or intellectual you have never met but whose work has had an impact on you) and who still affects your life in a significant manner through strong memories or life wisdom passed on to you.  You may also include pets.</p> 

<p>To help you remember all the people in your life, it might help to list people by category. The order of the list is not important.</p>
            </div>
	    </div>
		<div class="row">
		<div class="seven columns">
			<form action="survey-process.php" method="post" autocomplete="off">
             <!-- <textarea name="relationships" cols="50" rows="10" class="relationships" onkeypress="process(event, this)" id="relationships"></textarea> -->
  			<textarea name="relationships" cols="50" rows="10" class="relationships" id="relationships"></textarea>
		</div>
		<div class="five columns">
		<p>Type the name in any form: first name, nickname, initials, full name, or descriptive name (i.e. Nick the barber).</p>

		<p>Press RETURN after each name.</p>

		<p>Click DONE when finished.</p>
		<p>Names: <span id="result">0</span></p>
		<!--<span id="num">0</span> items-->
		<script type="text/javascript">
function wordCount( val ){
    var wom = val.match(/\S+/g);
    return {
        charactersNoSpaces : val.replace(/\s+/g, '').length,
        characters         : val.length,
        words              : wom ? wom.length : 0,
        lines              : val.split(/\r*\n/).length - 1
    };
}


var textarea = document.getElementById("relationships");
var result   = document.getElementById("result");

textarea.addEventListener("input", function(){
  var v = wordCount( this.value );
  result.innerHTML = (v.lines);
}, false);
</script>
		
		<br>
		<input type="submit" name="submit-pg2" value="Done" id="submit-pg2" />
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
