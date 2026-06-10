<?php
 
$host = "localhost";
$user = "root";
$password = "";
$nazwa_bazy = "phpclicker";
 
try {
    $pdo = new PDO("mysql:host=$host;dbname=$nazwa_bazy;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Nie można połączyć się z bazą danych: " . $e->getMessage());
}
