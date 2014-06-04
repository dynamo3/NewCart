<?php   

$mysqli = new mysqli("192.237.224.238", "bootcamp", "bootcamp", "bootcamp");

/* */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();  
}

$first_name = $_GET['first_name'];

$sql = "
    INSERT INTO `user` (`user_id`, `first_name`,
        `email`) VALUES (NULL, '" . $first_name . "', 'Homina@hominahomina.com'); 
    ";

if (mysqli_query($mysqli, $sql)) {
    echo "it'sa working";
} else {
    echo "it'sa not-a working";
}

?>