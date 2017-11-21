<?php
/*
example usage
screenShot ver 1.0
*/

//include screenShot class
include('screenshot.class.php');

//instantiate the class with the webpage url to capture
$screenShot = new screenShot('http://www.website.com');

//display html image tag for captured webpage
$screenShot->displayImage();

/*
The following demonstrates the download and display from captured binary
of the webpage. To use, uncomment the capturePage method to capture
the binary and then uncomment either the downloadCapture or displayCapture
methods, depending on which you wish to preform.
*/

//$screenShot->capturePage();

//$screenShot->downloadCapture('test.png');

//$screenShot->displayCapture();

?>
