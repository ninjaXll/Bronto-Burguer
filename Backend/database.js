const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'bronto_burger.db');

// Abre o banco de dados (cria se não existir)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Cria a tabela de pedidos se ela não existir
db.serialize(() => {
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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      customerPhone TEXT -- Nova coluna para o telefone
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedidoId INTEGER,
      itemName TEXT NOT NULL,
      itemPrice REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (pedidoId) REFERENCES pedidos (id)
    )
  `);
});

module.exports = db;