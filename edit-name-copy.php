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
	$('.edit').show();
        var file = "/edit-name.php";
		$.ajax({
			type: "POST",
			url: file,
			dataType: 'text',
			type: 'GET', 
            aysnc: false,
			data: { idNum: idNum },
			success: function(result){
                alert(result);
				window.location.reload(true);
                //pin number should return
            }
});
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
		   $query = mysql_query("SELECT firstname, lastname FROM clients WHERE therapist = '" . $userEmail . "' AND id = '" . $idNum . "'");
           //$result = mysql_query($query);
		   $table = "<table><tr><th>First Name</th><th>Last Name</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th><th>&nbsp;</th></tr>";
		   while($row1 = mysql_fetch_array($query))
		   {
			    if($row1['firstname'] != '' && $row1['lastname'] != '')
				{
					$table .="<tr>
                   <td id='".$row1['id']."'>".$row1['firstname']."</td>
				   <td id='".$row1['id']."'>".$row1['lastname']."</td>
				   <td><button id='".$row1['id']."' onclick='newName(this)'>EDIT NAME</button></td>
                    <td><button id='".$row1['id']."' onclick='add(this)'>ADD RELATIONSHIP</button></td>
                   <td><button id='".$row1['id']."' onclick='modify(this)'>DELETE RELATIONSHIP</button></td>
                   <td><button id='".$row1['id']."' onclick='delete(this)'>MODIFY RELATIONSHIP</button></td>
                   </tr>";
				}
		   }
		   $table .= "</table>";
		   echo $table;
		?>
		<div class="edit">
		   <form action="" method="post">
 <input type="hidden" name="id" value="<?php echo $clientId; ?>"/>
 <div>
 <strong>First Name: *</strong> <input type="text" name="formFirstname" id="formFirstname" value=""/><br/>
 <strong>Last Name: *</strong> <input type="text" name="formLastname" id="formLastname" value=""/><br/>
 <p>* Required</p>
 <input type="submit" name="submit" value="Submit">
 </div>
 </form> 

		</div>
			<!-- Add Relationship -->
			<h2>Add Relationship</h2>
			<?php
			$query = mysql_query("SELECT firstname, lastname FROM clients WHERE therapist = '" . $userEmail . "'");
           $result = mysql_query($query);
		   $table = "<table><tr><th>Name</th></tr>";
		   while($row1 = mysql_fetch_array($query))
		   {
			    if($row1['firstname'] != '' && $row1['lastname'] != '')
				{
					$fullname = $row1['firstname'] . " " . $row1['lastname'];
					$table .="<tr>
                   <td name='".$fullname."' onclick='newName()'><input type='radio' class='add-relation' name='add-relation' value='".$fullname."'>".$fullname."</td>
                    </tr>";
				}
		   }
		   $table .= "</table>";
		   echo $table;
		?>
			<!-- Delete Relationship -->
			<!-- Modify Relationship -->
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
