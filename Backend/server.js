const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega variáveis de ambiente do .env (opcional)

const db = require('./Database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON no body
app.use(express.json());

// Middleware para permitir requisições de qualquer origem (útil para desenvolvimento com frontend estático)
app.use(cors());

// Rota para receber um novo pedido (POST /api/pedidos)
app.post('/api/pedidos', (req, res) => {
  const {
    customerName,
    customerPhone,
    orderType,
    address,
    paymentMethod,
    changeValue,
    items,
    total
  } = req.body;

  // Validação básica
  if (!customerName || !customerPhone || !orderType || !paymentMethod || !items || !Array.isArray(items) || items.length === 0 || total === undefined) { // <- Adicionado customerPhone
    return res.status(400).json({ error: 'Dados do pedido incompletos.' });
  }

  if (orderType === 'entrega' && !address) {
    return res.status(400).json({ error: 'Endereço é obrigatório para entrega.' });
  }

  if (paymentMethod === 'dinheiro' && changeValue === undefined) {
    return res.status(400).json({ error: 'Valor do troco é obrigatório para pagamento em dinheiro.' });
  }

  // Inserir o pedido principal
  const insertPedidoSQL = `
    INSERT INTO pedidos (customerName, customerPhone, orderType, address, paymentMethod, changeValue, total) -- <- Adicionado customerPhone
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(insertPedidoSQL, [customerName, orderType, address, paymentMethod, changeValue, total], function (err) {
    if (err) {
      console.error('Erro ao inserir pedido:', err.message);
      return res.status(500).json({ error: 'Erro ao salvar pedido.' });
    }

    const pedidoId = this.lastID; // Obtém o ID do pedido recém-inserido

    // Inserir os itens do pedido
    const insertItemSQL = `
      INSERT INTO itens_pedido (pedidoId, itemName, itemPrice, quantity)
      VALUES (?, ?, ?, ?)
    `;

    let itemsInserted = 0;
    let hasError = false;

    items.forEach((item) => {
      db.run(insertItemSQL, [pedidoId, item.name, item.price, item.quantity], function (err) {
        if (err) {
          console.error('Erro ao inserir item do pedido:', err.message);
          hasError = true;
        }
        itemsInserted++;
        // Só responde quando todos os itens forem processados
        if (itemsInserted === items.length && !hasError) {
          res.status(201).json({ message: 'Pedido salvo com sucesso!', pedidoId });
        } else if (itemsInserted === items.length && hasError) {
          // Se houve erro, envia uma resposta de erro genérica
          res.status(500).json({ error: 'Erro ao salvar itens do pedido.' });
        }
      });
    });
  });
});

// Rota para obter o status de um pedido (GET /api/pedidos/:id)
app.get('/api/pedidos/:id', (req, res) => {
  const pedidoId = req.params.id;

  const sql = `
    SELECT p.*, GROUP_CONCAT(ip.itemName || ' x' || ip.quantity) as itens
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON p.id = ip.pedidoId
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.get(sql, [pedidoId], (err, row) => {
    if (err) {
      console.error('Erro ao buscar pedido:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json(row);
  });
});

// Nova Rota: Obter o status de um pedido por código (4 últimos dígitos do telefone + ID do pedido)
app.get('/api/pedidos/codigo/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  // Exemplo: código = "9876-123" -> 9876 são os 4 últimos do telefone, 123 é o ID
  // Isso é uma lógica de exemplo. Você pode definir o formato do código como quiser.
  // Por simplicidade, vamos considerar que o código é apenas os 4 últimos dígitos do telefone
  // e tentaremos encontrar o pedido mais recente com esse telefone e status ativo.
  // Se quiser um código único, você pode gerar um código aleatório e salvá-lo no banco.

  // Exemplo de código como "9876" (apenas os 4 últimos dígitos do telefone)
  const sql = `
    SELECT p.*, GROUP_CONCAT(ip.itemName || ' x' || ip.quantity) as itens
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON p.id = ip.pedidoId
    WHERE p.customerPhone LIKE ? AND p.status != 'Entregue' -- Apenas pedidos ativos
    ORDER BY p.createdAt DESC
    LIMIT 1 -- Retorna o pedido mais recente com esse telefone ativo
    GROUP BY p.id
  `;

  // Adiciona um wildcard para buscar telefone terminado em 'codigo'
  const telefoneFinal = `%${codigo}`;

  db.get(sql, [telefoneFinal], (err, row) => {
    if (err) {
      console.error('Erro ao buscar pedido por código:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar pedido.' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pedido não encontrado ou já entregue.' });
    }
    res.json(row);
  });
});

// Rota para atualizar o status de um pedido (PUT /api/pedidos/:id/status)
app.put('/api/pedidos/:id/status', (req, res) => {
  const pedidoId = req.params.id;
  const { novoStatus } = req.body;

  if (!novoStatus) {
    return res.status(400).json({ error: 'Novo status é obrigatório.' });
  }

  const sql = `UPDATE pedidos SET status = ? WHERE id = ?`;

  db.run(sql, [novoStatus, pedidoId], function (err) {
    if (err) {
      console.error('Erro ao atualizar status:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    res.json({ message: 'Status atualizado com sucesso!' });
  });
});

// Rota para obter todos os pedidos (GET /api/pedidos) - útil para o painel admin
app.get('/api/pedidos', (req, res) => {
  const sql = `
    SELECT p.*, GROUP_CONCAT(ip.itemName || ' x' || ip.quantity) as itens
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON p.id = ip.pedidoId
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
    res.json(rows);
  });
});

// Rota para obter pedidos por status (GET /api/pedidos/status/:status)
app.get('/api/pedidos/status/:status', (req, res) => {
  const status = req.params.status;
  const sql = `
    SELECT p.*, GROUP_CONCAT(ip.itemName || ' x' || ip.quantity) as itens
    FROM pedidos p
    LEFT JOIN itens_pedido ip ON p.id = ip.pedidoId
    WHERE p.status = ?
    GROUP BY p.id
    ORDER BY p.createdAt DESC
  `;

  db.all(sql, [status], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar pedidos por status:', err.message);
      return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }
    res.json(rows);
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
