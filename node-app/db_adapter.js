/**
 * Database Adapter for Concurso Poetas
 */

const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');

let connection;
let dbInstance;

const type = process.env.DB_TYPE || 'mock';

async function connect() {
    console.log(`🔌 Probando conexión con: [${type.toUpperCase()}]`);

    if (type === 'mysql') {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        console.log('✅ MySQL conectado.');
    } else if (type === 'mongo') {
        const client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        dbInstance = client.db(process.env.DB_NAME || 'concurso_poetas');
        console.log('✅ MongoDB conectado.');
    } else {
        console.log('⚠️ Modo Mock: Los datos no persistirán reinicios de servidor.');
        dbInstance = []; // In-memory fallback
    }
}

async function savePoem({ name, poem, clave }) {
    if (type === 'mysql') {
        const sql = 'INSERT INTO poemas (poeta_nombre, poema, clave) VALUES (?, ?, ?)';
        await connection.execute(sql, [name, poem, clave]);
    } else if (type === 'mongo') {
        const collection = dbInstance.collection('poemas');
        await collection.insertOne({ poeta_nombre: name, poema: poem, clave, created_at: new Date() });
    } else {
        dbInstance.push({ id: dbInstance.length + 1, poeta_nombre: name, poema: poem, clave });
    }
}

async function getPublicPoems() {
    if (type === 'mysql') {
        const [rows] = await connection.execute('SELECT poema, clave FROM poemas ORDER BY created_at DESC');
        return rows;
    } else if (type === 'mongo') {
        return await dbInstance.collection('poemas')
            .find({}, { projection: { poeta_nombre: 0, _id: 0 } })
            .sort({ created_at: -1 })
            .toArray();
    } else {
        return dbInstance.map(({ poema, clave }) => ({ poema, clave })).reverse();
    }
}

async function getAllRecords() {
    if (type === 'mysql') {
        const [rows] = await connection.execute('SELECT clave, poeta_nombre FROM poemas');
        return rows;
    } else if (type === 'mongo') {
        return await dbInstance.collection('poemas')
            .find({}, { projection: { clave: 1, poeta_nombre: 1, _id: 0 } })
            .toArray();
    } else {
        return dbInstance.map(({ clave, poeta_nombre }) => ({ clave, poeta_nombre }));
    }
}

module.exports = { connect, savePoem, getPublicPoems, getAllRecords };
