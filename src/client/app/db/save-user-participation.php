<?php
include "db-config.php";

try {
    $db = new PDO($DB_DSN, $DB_USER, $DB_PASS);

    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data["userId"];
    $userParticipation = $data["userParticipation"];

    $db->exec("UPDATE $DB_TABLE SET participation='$userParticipation' WHERE user_id='$userId'");

    $db = null;
} catch(PDOException $e) {
    echo "error creating PDO " . $e;
    $db = null;
}
?>
