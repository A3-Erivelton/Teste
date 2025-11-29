require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Dados fictícios das empresas
const usuarios = [
  // 1. Admin
  { 
    nome: 'Administrador', 
    email: 'admin@locservice.com', 
    senha: 'admin123',
    categoria: null,
    descricao: 'Conta administrativa do sistema',
    whatsapp: null,
    isAdmin: true 
  },
  
  // 2. Jardins & Cia
  { 
    nome: 'Jardins & Cia', 
    email: 'jardins@locservice.com', 
    senha: 'jardim123',
    categoria: 'Jardinagem',
    descricao: 'Jardinagem, poda e paisagismo para áreas comuns e residências.',
    whatsapp: '(84) 99999-1111',
    isAdmin: false 
  },
  
  // 3. Limpa Tudo
  { 
    nome: 'Limpa Tudo', 
    email: 'limpatudo@locservice.com', 
    senha: 'limpa123',
    categoria: 'Limpeza',
    descricao: 'Limpeza residencial e de áreas comuns com equipe treinada.',
    whatsapp: '(84) 99999-2222',
    isAdmin: false 
  },
  
  // 4. Repara Bem
  { 
    nome: 'Repara Bem', 
    email: 'reparabem@locservice.com', 
    senha: 'repara123',
    categoria: 'Manutenção',
    descricao: 'Pequenos reparos, elétrica e hidráulica com garantia.',
    whatsapp: '(84) 99999-3333',
    isAdmin: false 
  },
  
  // 5. PetCare
  { 
    nome: 'PetCare', 
    email: 'petcare@locservice.com', 
    senha: 'pet123',
    categoria: 'Pet Care',
    descricao: 'Banho, tosa e cuidados especiais para o seu pet.',
    whatsapp: '(84) 99999-4444',
    isAdmin: false 
  },
  
  // 6. Fitness Point
  { 
    nome: 'Fitness Point', 
    email: 'fitness@locservice.com', 
    senha: 'fitness123',
    categoria: 'Academia',
    descricao: 'Academia do condomínio com treinos orientados.',
    whatsapp: '(84) 99999-5555',
    isAdmin: false 
  },
  
  // 7. TechCondo
  { 
    nome: 'TechCondo', 
    email: 'techcondo@locservice.com', 
    senha: 'tech123',
    categoria: 'Tecnologia',
    descricao: 'Internet, câmeras, automação e suporte técnico residencial.',
    whatsapp: '(84) 99999-6666',
    isAdmin: false 
  },
  
  // 8. Pão da Vila
  { 
    nome: 'Pão da Vila', 
    email: 'paodavila@locservice.com', 
    senha: 'pao123',
    categoria: 'Padaria',
    descricao: 'Padaria artesanal com entregas dentro do condomínio.',
    whatsapp: '(84) 99999-7777',
    isAdmin: false 
  },
  
  // 9. Conserta+
  { 
    nome: 'Conserta+', 
    email: 'consertamais@locservice.com', 
    senha: 'conserta123',
    categoria: 'Manutenção',
    descricao: 'Assistência para eletrodomésticos e eletrônicos.',
    whatsapp: '(84) 99999-8888',
    isAdmin: false 
  }
];

async function seedUsers() {
  let connection;
  
  try {
    console.log('🌱 SEED - POPULANDO BANCO DE DADOS');
    console.log('====================================\n');
    
    // Conectar ao MySQL
    console.log('📡 Conectando ao MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Conectado ao MySQL!\n');
    
    // Limpar tabela antes de inserir (opcional)
    console.log('🗑️  Limpando tabela usuarios...');
    await connection.query('DELETE FROM usuarios');
    console.log('✅ Tabela limpa!\n');
    
    console.log('📝 Inserindo usuários...\n');
    
    // Inserir cada usuário
    for (const user of usuarios) {
      try {
        // Criptografar senha
        const hashedPassword = await bcrypt.hash(user.senha, 10);
        
        // Inserir no banco
        const [result] = await connection.query(
          `INSERT INTO usuarios 
           (nome, email, senha, categoria, descricao, whatsapp, is_admin) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            user.nome,
            user.email,
            hashedPassword,
            user.categoria,
            user.descricao,
            user.whatsapp,
            user.isAdmin
          ]
        );
        
        console.log(`✅ ${user.nome} (${user.email})`);
        
      } catch (error) {
        console.error(`❌ Erro ao inserir ${user.nome}:`, error.message);
      }
    }
    
    // Verificar quantos registros foram inseridos
    const [rows] = await connection.query('SELECT COUNT(*) as total FROM usuarios');
    const total = rows[0].total;
    
    console.log('\n====================================');
    console.log(`✅ ${total} usuários inseridos com sucesso!`);
    console.log('====================================\n');
    
    // Mostrar resumo
    console.log('📊 Resumo:');
    const [admins] = await connection.query('SELECT COUNT(*) as total FROM usuarios WHERE is_admin = 1');
    const [empresas] = await connection.query('SELECT COUNT(*) as total FROM usuarios WHERE is_admin = 0');
    
    console.log(`   👑 Admins: ${admins[0].total}`);
    console.log(`   🏢 Empresas: ${empresas[0].total}\n`);
    
    // Mostrar categorias
    const [categorias] = await connection.query(`
      SELECT categoria, COUNT(*) as total 
      FROM usuarios 
      WHERE is_admin = 0 AND categoria IS NOT NULL 
      GROUP BY categoria
      ORDER BY total DESC
    `);
    
    console.log('📂 Categorias:');
    categorias.forEach(cat => {
      console.log(`   - ${cat.categoria}: ${cat.total} empresa(s)`);
    });
    
    console.log('\n💡 Dados de Login:');
    console.log('   Admin: admin@locservice.com / admin123');
    console.log('   Empresa: jardins@locservice.com / jardim123');
    console.log('\n✅ Seed concluído com sucesso!\n');
    
  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   - Você executou "npm run setup" antes?');
    console.error('   - O banco de dados existe?');
    console.error('   - A tabela usuarios existe?');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão encerrada');
    }
  }
}

// Executar
seedUsers();
