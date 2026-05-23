<?php
session_start();
header('Content-Type: application/json');

require_once 'db.php';

$action = $_POST['action'] ?? '';

if ($action === 'register') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (strlen($username) < 3 || strlen($username) > 50) {
        echo json_encode(['success' => false, 'message' => 'Nazwa użytkownika musi mieć 3-50 znaków.']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Hasło musi mieć co najmniej 6 znaków.']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Ta nazwa użytkownika jest już zajęta.']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    $stmt->execute([$username, $hash]);
    $userId = $pdo->lastInsertId();

    $stmt = $pdo->prepare('INSERT INTO game_saves (user_id) VALUES (?)');
    $stmt->execute([$userId]);

    $_SESSION['user_id']  = $userId;
    $_SESSION['username'] = $username;

    echo json_encode(['success' => true, 'message' => 'Zarejestrowano!', 'username' => $username]);
    exit;
}

if ($action === 'login') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare('SELECT id, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Nieprawidłowa nazwa użytkownika lub hasło.']);
        exit;
    }

    $_SESSION['user_id']  = $user['id'];
    $_SESSION['username'] = $username;

    echo json_encode(['success' => true, 'message' => 'Zalogowano!', 'username' => $username]);
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Nieznana akcja.']);
