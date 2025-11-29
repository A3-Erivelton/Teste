const User = require('../models/User');

// Listar todas as empresas (público)
exports.getAll = async (req, res) => {
  try {
    const { categoria } = req.query;
    
    const empresas = await User.getAllEmpresas(categoria);
    
    res.json({
      success: true,
      data: empresas,
      total: empresas.length
    });
    
  } catch (error) {
    console.error('Erro no getAll:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Buscar empresa por ID (público)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const empresa = await User.findById(id);
    
    if (!empresa || empresa.is_admin) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: empresa.id,
        nome: empresa.nome,
        categoria: empresa.categoria,
        descricao: empresa.descricao,
        whatsapp: empresa.whatsapp,
        createdAt: empresa.created_at
      }
    });
    
  } catch (error) {
    console.error('Erro no getById:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Buscar empresas por nome (público)
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Parâmetro "q" é obrigatório'
      });
    }
    
    const empresas = await User.searchByName(q);
    
    res.json({
      success: true,
      data: empresas,
      total: empresas.length
    });
    
  } catch (error) {
    console.error('Erro no search:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Estatísticas de categorias (público)
exports.stats = async (req, res) => {
  try {
    const stats = await User.countByCategoria();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Erro no stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};
