<?php
session_start();
header('Content-Type: application/json');

require_once 'db.php';

if (empty($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Nie jesteś zalogowany.']);
    exit;
}

$userId = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

if ($action === 'save') {
    $fields = ['points', 'value_of_click', 'value_of_auto',
               'critical_chance', 'critical_multiplier', 'combo_multiplier',
               'cost_upgrade1', 'cost_upgrade2', 'cost_upgrade3',
               'cost_upgrade4', 'cost_upgrade5', 'cost_upgrade6',
               'cost_upgrade7', 'cost_upgrade8', 'cost_upgrade9'];

    $data = [];
    foreach ($fields as $f) {
        if (in_array($f, ['critical_chance', 'critical_multiplier', 'combo_multiplier'])) {
            $data[$f] = floatval($_POST[$f] ?? 0);
        } else {
            $data[$f] = intval($_POST[$f] ?? 0);
        }
    }
    $data['user_id'] = $userId;

    $stmt = $pdo->prepare('
        INSERT INTO game_saves
            (user_id, points, value_of_click, value_of_auto,
             critical_chance, critical_multiplier, combo_multiplier,
             cost_upgrade1, cost_upgrade2, cost_upgrade3,
             cost_upgrade4, cost_upgrade5, cost_upgrade6,
             cost_upgrade7, cost_upgrade8, cost_upgrade9)
        VALUES
            (:user_id, :points, :value_of_click, :value_of_auto,
             :critical_chance, :critical_multiplier, :combo_multiplier,
             :cost_upgrade1, :cost_upgrade2, :cost_upgrade3,
             :cost_upgrade4, :cost_upgrade5, :cost_upgrade6,
             :cost_upgrade7, :cost_upgrade8, :cost_upgrade9)
        ON DUPLICATE KEY UPDATE
            points         = VALUES(points),
            value_of_click = VALUES(value_of_click),
            value_of_auto  = VALUES(value_of_auto),
            critical_chance = VALUES(critical_chance),
            critical_multiplier = VALUES(critical_multiplier),
            combo_multiplier = VALUES(combo_multiplier),
            cost_upgrade1  = VALUES(cost_upgrade1),
            cost_upgrade2  = VALUES(cost_upgrade2),
            cost_upgrade3  = VALUES(cost_upgrade3),
            cost_upgrade4  = VALUES(cost_upgrade4),
            cost_upgrade5  = VALUES(cost_upgrade5),
            cost_upgrade6  = VALUES(cost_upgrade6),
            cost_upgrade7  = VALUES(cost_upgrade7),
            cost_upgrade8  = VALUES(cost_upgrade8),
            cost_upgrade9  = VALUES(cost_upgrade9)
    ');
    $stmt->execute($data);

    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'load') {
    $stmt = $pdo->prepare('SELECT * FROM game_saves WHERE user_id = ?');
    $stmt->execute([$userId]);
    $save = $stmt->fetch();

    if (!$save) {
        echo json_encode(['success' => false, 'message' => 'Brak zapisu.']);
        exit;
    }

    echo json_encode(['success' => true, 'save' => $save]);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Nieznana akcja.']);
