const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Gerar token JWT
function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      isAdmin: user.is_admin 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

// Registrar nova empresa
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, categoria, descricao, whatsapp } = req.body;
    
    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }
    
    if (senha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter no mínimo 6 caracteres'
      });
    }
    
    // Verificar se email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }
    
    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    // Criar usuário
    const userId = await User.create(nome, email, hashedPassword, categoria, descricao, whatsapp);
    const user = await User.findById(userId);
    
    // Gerar token
    const token = generateToken(user);
    
    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      data: {
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          categoria: user.categoria,
          isAdmin: user.is_admin
        }
      }
    });
    
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    // Validações
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }
    
    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }
    
    // Gerar token
    const token = generateToken(user);
    
    res.json({
      success: true,
      message: `Bem-vindo, ${user.nome}!`,
      data: {
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          categoria: user.categoria,
          descricao: user.descricao,
          whatsapp: user.whatsapp,
          isAdmin: user.is_admin
        }
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Obter dados do usuário logado
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        categoria: user.categoria,
        descricao: user.descricao,
        whatsapp: user.whatsapp,
        isAdmin: user.is_admin,
        createdAt: user.created_at
      }
    });
    
  } catch (error) {
    console.error('Erro no me:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Atualizar dados do usuário logado
exports.updateMe = async (req, res) => {
  try {
    const { nome, categoria, descricao, whatsapp } = req.body;
    
    const updated = await User.update(req.userId, {
      nome,
      categoria,
      descricao,
      whatsapp
    });
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum dado foi atualizado'
      });
    }
    
    const user = await User.findById(req.userId);
    
    res.json({
      success: true,
      message: 'Dados atualizados com sucesso!',
      data: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        categoria: user.categoria,
        descricao: user.descricao,
        whatsapp: user.whatsapp
      }
    });
    
  } catch (error) {
    console.error('Erro no updateMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};
