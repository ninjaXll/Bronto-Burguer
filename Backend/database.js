const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'bronto_burger.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite.');
    initDb();
  }
});

function initDb() {
  // Cria a tabela alinhada com o server.js
  const sqlCreate = `
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_pedido TEXT,
      cliente TEXT,
      telefone TEXT,
      tipo TEXT,
      endereco TEXT,
      pagamento TEXT,
      troco REAL,
      itens TEXT,
      total REAL,
      status TEXT DEFAULT 'recebido',
      data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      orderType TEXT NOT NULL,
      address TEXT,
      paymentMethod TEXT NOT NULL,
      changeValue TEXT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Recebido',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,  /* <--- FALTAVA ESTA VÍRGULA AQUI */
      customerPhone TEXT
    )
  `);
}

module.exports = db;