<?php
session_start();
//connect to the database so we can check, edit, or insert data to our users table
include("dbconfig.php");



$con = mysql_connect($dbhost, $dbuser, $dbpassword) or die(mysql_error());
$db = mysql_select_db('a8990775_scrs', $con) or die(mysql_error());

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
  
  <!-- JavaScript
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <script type='text/javascript' src='/js/functions.js'></script>


</head>
<body>

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
  <!--Header-->
  <div class="row header">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns"><center><h1>LOG IN</h1></center></div>
  <div class="two columns">&nbsp;</div>
  </div>
  <!--Navigation and Logo-->
  <div class="row">
  <div class="two columns">&nbsp;</div>
  <div class="eight columns">
    
<?php
if (isset($_POST['submit'])) {
	$password = $_POST['password'];
    // No password confirmation required, otherwise $passconf = protect($_REQUEST['passconf']);
    $email = $_POST['email'];
	$formStep = $_POST['formStep'];
	
	if (!$password || !$email) {
		 echo "<br><br><center>You need to fill in all of the required fields!</center>";
		 echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
	}
	else {
		if (strlen($password) < 5) {
                //if it is display error message
                echo "<br><br><center>Your <b>Password</b> must be more than 5 characters long!</center>";
                echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
            } else {
				$checkemail = "/^[a-z0-9]+([_\\.-][a-z0-9]+)*@([a-z0-9]+([\.-][a-z0-9]+)*)+\\.[a-z]{2,}$/i";
                //check if the formats match
                if (!preg_match($checkemail, $email)) {
                    //if not display error message
                    echo "<br><br><center>The <b>E-mail</b> is not valid, must be name@server.tld!</center>";
                    echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
                } 
                else {
					$result = mysql_query("SELECT * FROM therapists WHERE email = '" . $email . "'");
					//$result = mysql_query($query);
					if ($result)
					{
						$query = mysql_query("SELECT firstname, lastname, email, password FROM therapists WHERE email = '" . $email . "'");
                        //$result = mysql_query($query);
                        $row = mysql_fetch_assoc($query);
						 $firstname = $row['firstname'];
                         $foundEmail = $row['email'];
                         $foundPass = $row['password'];
						 $lastname = $row['lastname'];
						 
						 if ($foundPass == $password)
						 {
							 if ($foundEmail == $email)
							 {
								 $_SESSION['pass'] = $password;
								 $_SESSION['email'] = $email;
								 $_SESSION['firstname'] = $firstname;
								 $_SESSION['lastname'] = $lastname;
								 $_SESSION['login'] = "true";
								 $_SESSION['ID'] = uniqid();
                                 echo "<center>Logging in...</center>";	
                                 header('Location: userHome.php');								 
                                 								 
							 }
							 else{
								   echo "<br><br><center>User not found</center>";
                                 echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
							 }
						 }
						 else
						 {
							  echo "<br><br><center>Incorrect password</center>";
                              echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
						 }
					}
					else
					{
						echo "<br><br><center>User not found!</center>";
                        echo '<br><br><center><a href="http://scrs-test.comli.com"><button type="button" id="back">Go back to Login</button></a></center>';
					}
				}
			}
	}
}
?>
     </div>
  <div class="two columns">&nbsp;</div>
  </div>
 
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
