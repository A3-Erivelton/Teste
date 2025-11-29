const { pool } = require('../config/database');

class User {
  
  // Buscar usuário por email
  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }
  
  // Buscar usuário por ID
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, nome, email, categoria, descricao, whatsapp, is_admin, created_at FROM usuarios WHERE id = ?',
      [id]
    );
    return rows[0];
  }
  
  // Criar novo usuário (empresa)
  static async create(nome, email, senha, categoria = null, descricao = null, whatsapp = null) {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, categoria, descricao, whatsapp, is_admin) VALUES (?, ?, ?, ?, ?, ?, 0)',
      [nome, email, senha, categoria, descricao, whatsapp]
    );
    return result.insertId;
  }
  
  // Atualizar dados da empresa
  static async update(id, dados) {
    const fields = [];
    const values = [];
    
    if (dados.nome) {
      fields.push('nome = ?');
      values.push(dados.nome);
    }
    if (dados.categoria) {
      fields.push('categoria = ?');
      values.push(dados.categoria);
    }
    if (dados.descricao !== undefined) {
      fields.push('descricao = ?');
      values.push(dados.descricao);
    }
    if (dados.whatsapp !== undefined) {
      fields.push('whatsapp = ?');
      values.push(dados.whatsapp);
    }
    
    if (fields.length === 0) {
      throw new Error('Nenhum campo para atualizar');
    }
    
    values.push(id);
    
    const [result] = await pool.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result.affectedRows > 0;
  }
  
  // Deletar usuário (apenas admin)
  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM usuarios WHERE id = ? AND is_admin = 0',
      [id]
    );
    return result.affectedRows > 0;
  }
  
  // Listar todas as empresas (sem admin)
  static async getAllEmpresas(categoria = null) {
    let query = 'SELECT id, nome, categoria, descricao, whatsapp, created_at FROM usuarios WHERE is_admin = 0';
    const params = [];
    
    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }
    
    query += ' ORDER BY nome ASC';
    
    const [rows] = await pool.query(query, params);
    return rows;
  }
  
  // Buscar empresas por nome
  static async searchByName(termo) {
    const [rows] = await pool.query(
      'SELECT id, nome, categoria, descricao, whatsapp FROM usuarios WHERE is_admin = 0 AND nome LIKE ? ORDER BY nome ASC',
      [`%${termo}%`]
    );
    return rows;
  }
  
  // Contar empresas por categoria
  static async countByCategoria() {
    const [rows] = await pool.query(
      'SELECT categoria, COUNT(*) as total FROM usuarios WHERE is_admin = 0 AND categoria IS NOT NULL GROUP BY categoria ORDER BY total DESC'
    );
    return rows;
  }
}

module.exports = User;
