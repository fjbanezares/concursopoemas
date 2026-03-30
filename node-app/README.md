# 🌹 Cápsula de Cristal - Sistema de Concurso Poético

Una aplicación premium para gestionar concursos de poesía con anonimato garantizado. Los poetas envían sus datos y el sistema genera una clave única (ej. `POETA-XJ92`) para identificarlos al final de las votaciones.

## 🛠️ Configuración de Base de Datos

Puedes elegir entre **MySQL (IONOS/1and1)** o **MongoDB (Atlas)**.

### Opción A: MySQL (Recomendada para tu servidor 1and1)
1. Accede a tu panel de control de 1and1.
2. Crea una base de datos MySQL llamada `concurso_poetas`.
3. Ejecuta el script `db.sql` incluido para crear la tabla necesaria.
4. Anota el **Host**, **Usuario** y **Contraseña** que te proporcione el servidor.

### Opción B: MongoDB (Tier Gratuito)
1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea una base de datos `concurso_poetas`.
3. Obtén tu **URI de conexión**.

---

## 🚀 Despliegue en 1and1

Para desplegar esta aplicación en 1and1 tienes varias opciones dependiendo de tu plan:

### 1. Si tienes un Servidor Cloud/VPS (Recomendado):
1. Instala Node.js en el servidor.
2. Sube la carpeta del proyecto vía FTP o Git.
3. Ejecuta `npm install`.
4. Crea un archivo `.env` basado en `.env.example`.
5. Inicia con `npm start` (o usa un gestor como `pm2`).

### 2. Si tienes Hosting Compartido (Standard):
Los hostings básicos de 1and1 suelen usar PHP/Apache. Si no puedes ejecutar Node.js, dímelo y puedo adaptarte el backend a **PHP**, manteniendo este mismo diseño premium.

---

## 🧪 Ejecución Local (Prueba)
1. Renombra `.env.example` a `.env`.
2. Ejecuta:
   ```bash
   npm install
   node server.js
   ```
3. Por defecto, si no configuras DB, usará el modo "Mock" (en memoria) para que veas el diseño.

---

## 🔐 Administración
Para saber quién está detrás de cada poema:
1. Haz clic en "Ver Identidades Secretas" al pie de la web.
2. Introduce la clave que hayas puesto en `ADMIN_PASSWORD` en tu `.env`.
