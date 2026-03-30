<?php
/**
 * API REST en PHP para Concurso Poético
 */

require_once 'db_config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $action = isset($_GET['action']) ? $_GET['action'] : '';

    // 1. OBTENER POEMAS (ANONIMIZADOS)
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
        $pdo = getDBConnection();
        $pdo->exec("SET NAMES utf8mb4");
        $stmt = $pdo->query("SELECT poema, clave FROM poemas ORDER BY created_at DESC");
        $poems = $stmt->fetchAll();
        $json = json_encode($poems);
        if ($json === false) throw new Exception("Error codificando JSON: " . json_last_error_msg());
        echo $json;
    }

    // 2. GUARDAR POEMA (GENERAR CLAVE)
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'save') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['name']) || empty($data['poem'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nombre y poema son obligatorios']);
            exit;
        }

        $pdo = getDBConnection();
        $pdo->exec("SET NAMES utf8mb4");
        
        // Generación de clave única
        $clave = "POETA-" . strtoupper(substr(md5(uniqid()), 0, 4));

        $sql = "INSERT INTO poemas (poeta_nombre, poema, clave) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['name'], $data['poem'], $clave]);
        echo json_encode(['message' => 'Éxito', 'clave' => $clave]);
    }

    // 3. REVELAR IDENTIDADES (ADMIN)
    elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'reveal') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['password']) || $data['password'] !== ADMIN_PASSWORD) {
            http_response_code(403);
            echo json_encode(['message' => 'Clave Maestra Incorrecta']);
            exit;
        }

        $pdo = getDBConnection();
        $pdo->exec("SET NAMES utf8mb4");
        $stmt = $pdo->query("SELECT clave, poeta_nombre FROM poemas");
        $results = $stmt->fetchAll();
        echo json_encode(['results' => $results]);
    }

    else {
        http_response_code(404);
        echo json_encode(['message' => 'Ruta no encontrada']);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Error Interno del Servidor',
        'debug' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ]);
}
?>
