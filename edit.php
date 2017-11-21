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
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
  <!-- Functions for Edit Page -->
  <style>
   .edit
   {
	   display:none;
   }
  </style>
  <script>
function newName(x) {
	var idNum = x.getAttribute("id");
	alert(idNum);
        var file = "/edit-name-copy.php";
}

$(document).ready(function() {
    //set initial state.
    $("input:radio[name=add-relation]").click(function() {
		var value = $(this).val();
	});
});
</script>

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
		   $query = mysql_query("SELECT DISTINCT id, firstname, lastname FROM clients WHERE therapist = '" . $userEmail . "'");
           //$result = mysql_query($query);
		   $table = "<table><tr><th>First Name</th><th>Last Name</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
		   while($row1 = mysql_fetch_array($query))
		   {
			    if($row1['firstname'] != '' && $row1['lastname'] != '')
				{
					$table .="<form action='edit-process.php' method='post' autocomplete='off'><tr>
                   <td id='".$row1['id']."'>".$row1['firstname']."</td>
				   <td id='".$row1['id']."'>".$row1['lastname']."</td>
				   <input type='hidden' class='users input1 required id' minlength='4' name='id' value='".$row1['id']."'/>
				   <td> <input type='submit' name='edit-name' value='EDIT NAME' id='edit-name' /></td>
                    <td><input type='submit' name='add-relationship' value='ADD RELATIONSHIP' id='add-relationship' /></td>
                   <td><input type='submit' name='delete' value='DELETE RELATIONSHIP' id='delete' /></td>
                   <td><input type='submit' name='modify' value='MODIFY RELATIONSHIP' id='modify' /></td>
                   </tr></form>";
				}
		   }
		   $table .= "</table>";
		   echo $table;
		?>


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
