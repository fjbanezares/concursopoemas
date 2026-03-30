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
