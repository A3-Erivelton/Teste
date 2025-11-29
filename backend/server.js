require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const empresaRoutes = require('./routes/empresaRoutes');

// Criar app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API LocService funcionando!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/empresas', empresaRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Testar conexão com MySQL
    await testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}/api/health`);
      console.log(`\n💡 Rotas disponíveis:`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   GET    /api/auth/me (protegida)`);
      console.log(`   PUT    /api/auth/me (protegida)`);
      console.log(`   GET    /api/empresas`);
      console.log(`   GET    /api/empresas/:id`);
      console.log(`   GET    /api/empresas/search?q=termo`);
      console.log(`   GET    /api/empresas/stats`);
      console.log(`\n✅ Backend pronto para uso!\n`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
