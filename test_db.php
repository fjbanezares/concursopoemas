<?php
/**
 * Herramienta de Diagnóstico para la Base de Datos en IONOS
 */
require_once 'db_config.php';

header('Content-Type: text/plain');

echo "--- Diagnóstico de Conexión ---\n";
echo "Host: " . DB_HOST . "\n";
echo "Usuario: " . DB_USER . "\n";
echo "Base de Datos: " . DB_NAME . "\n";

try {
    $pdo = getDBConnection();
    echo "✅ Conexión establecida con éxito.\n";

    // --- OPCIÓN DE AUTO-SETUP ---
    if (isset($_GET['setup']) && $_GET['setup'] === 'TRUE') {
        echo "\n🛠️ Iniciando creación de tabla...\n";
        $sql = "CREATE TABLE IF NOT EXISTS `poemas` (
          `id` INT AUTO_INCREMENT PRIMARY KEY,
          `poeta_nombre` VARCHAR(255) NOT NULL,
          `poema` TEXT NOT NULL,
          `clave` VARCHAR(15) NOT NULL UNIQUE,
          `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
        
        $pdo->exec($sql);
        echo "✅ Tabla 'poemas' creada corectamente.\n";
    }

    // Probar si la tabla existe
    $stmt = $pdo->query("SHOW TABLES LIKE 'poemas'");
    if ($stmt->fetch()) {
        echo "✅ La tabla 'poemas' existe.\n";
        
        // Contar registros
        $count = $pdo->query("SELECT COUNT(*) FROM poemas")->fetchColumn();
        echo "📊 Total de poemas registrados: " . $count . "\n";
    } else {
        echo "❌ ERROR: La tabla 'poemas' NO existe. ¿Has importado db.sql?\n";
    }

} catch (Exception $e) {
    echo "❌ ERROR FATAL: " . $e->getMessage() . "\n";
}
?>
