<link rel="stylesheet" href="db.css"></link>

<?php   

$mysqli = new mysqli("192.237.224.238", "bootcamp", "bootcamp", "bootcamp");

/* */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();  
}

$sql = "
    SELECT *
    FROM user
    LEFT JOIN user_address USING ( user_id )
    WHERE street IS NULL
    ";

if ($results = mysqli_query($mysqli, $sql)) {
    echo "we have: <br>";
    echo $results->num_rows ;
    echo " rows.<br>";

echo "<h3><span class=\"first_name\">Namey</span><span class=\"email\">Email</span><span class=\"user_id\">User Id</span></h3><br>";

while ($row = $results->fetch_assoc()) {
    echo $row['user_id'] . "&nbsp;" . $row['first_name'];
    echo '&nbsp;';
    echo $row['street'] . "&nbsp;" . $row['state'] . "&nbsp;" . $row['zip'] ."<br>";
}

} else {
    echo "it'sa not-a working";
}

?>