<?php
/**
 * Configuración de Base de Datos MySQL para IONOS / 1and1
 */

// Sustituye estos valores por los que te proporciona IONOS en su panel
define('DB_HOST', 'db5020121108.hosting-data.io'); // Ejemplo: db50xxxxxx.hosting-data.io
define('DB_NAME', 'dbs15497267');                   // El nombre que le diste a la base de datos
define('DB_USER', 'dbu1502546');                   // El usuario que te asignaron
define('DB_PASS', 'Cascara@33@');            // Tu contraseña
define('DB_PORT', '3306');

// Clave Maestra para revelar identidades (Admin)
define('ADMIN_PASSWORD', 'VersoSecreto2026');

function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (\PDOException $e) {
        // En producción, no mostrar el mensaje de error completo por seguridad
        http_response_code(500);
        echo json_encode(['message' => 'Error de conexión a la base de datos: ' . $e->getMessage()]);
        exit;
    }
}
?>
