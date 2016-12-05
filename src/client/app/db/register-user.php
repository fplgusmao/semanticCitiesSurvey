<?php
include "db-config.php";

/**
 * Check if a table exists in the current database.
 *
 * @param PDO $pdo PDO instance connected to a database.
 * @param string $table Table to search for.
 * @return bool TRUE if table exists, FALSE if no table found.
 */
function tableExists($pdo, $table) {

    // Try a select statement against the table
    // Run it in try/catch in case PDO is in ERRMODE_EXCEPTION.
    try {
        $result = $pdo->query("SELECT 1 FROM $table LIMIT 1");
    } catch (Exception $e) {
        // We got an exception == table not found
        return FALSE;
    }

    // Result is either boolean FALSE (no table found) or PDOStatement Object (table found)
    return $result !== FALSE;
}

try {
    $db = new PDO($DB_DSN, $DB_USER, $DB_PASS);

    $data = json_decode(file_get_contents('php://input'), true);
    $userParticipation = $data["userParticipation"];

    //check if table exists
    $tableExists = tableExists($db, $DB_TABLE);

    if ($tableExists !== TRUE) {
        $db->exec("CREATE TABLE $DB_TABLE (user_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, participation MEDIUMTEXT)");
    }

    $st = $db->exec("INSERT INTO $DB_TABLE(participation) VALUES (NULL)");

    $stmt = $db->query("SELECT LAST_INSERT_ID() from $DB_TABLE");
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $userId = $row["LAST_INSERT_ID()"];
    }

    echo $userId;

    $db = null;
} catch(PDOException $e) {
    echo "error creating PDO" . $e;
    $db = null;
}
?>
