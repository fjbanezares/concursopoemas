/**
 * Poetry App - Elegant Backend
 * Supporting MySQL (1and1) and MongoDB (Free Tier)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db_adapter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// --- Middlewares ---

// --- Endpoints ---

// PUBLIC: Get list of anonymized poems
app.get('/api/poems', async (req, res) => {
    try {
        const poems = await db.getPublicPoems();
        res.json(poems);
    } catch (error) {
        console.error('Error fetching poems:', error);
        res.status(500).json({ message: 'Error recuperando poemas' });
    }
});

// PUBLIC: Submit a new poem
app.post('/api/poems', async (req, res) => {
    const { name, poem } = req.body;

    if (!name || !poem) {
        return res.status(400).json({ message: 'Nombre y poema son obligatorios' });
    }

    try {
        // Generar clave única de anonimización (e.g. POETA-A9B3)
        const clave = `POETA-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        await db.savePoem({ name, poem, clave });
        
        res.status(201).json({ message: 'Poema guardado con éxito', clave });
    } catch (error) {
        console.error('Error saving poem:', error);
        res.status(500).json({ message: 'No se pudo guardar el poema' });
    }
});

// ADMIN: Reveal identities (requires password)
app.post('/api/admin/reveal', async (req, res) => {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(403).json({ message: 'Acceso Denegado' });
    }

    try {
        const results = await db.getAllRecords();
        res.json({ results });
    } catch (error) {
        res.status(500).json({ message: 'Error revelando identidades' });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize DB and Start
async function start() {
    try {
        await db.connect();
        app.listen(PORT, () => {
            console.log(`✨ El oráculo de los versos está en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('CRITICAL: Fallo al conectar con la base de datos:', err);
    }
}

start();
