require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 SETUP DO BANCO DE DADOS');
    console.log('====================================\n');
    
    // Conectar ao MySQL (sem especificar o banco)
    console.log('📡 Conectando ao MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true // Permite executar múltiplos comandos
    });
    
    console.log('✅ Conectado ao MySQL!\n');
    
    // Ler o arquivo SQL
    console.log('📖 Lendo arquivo database.sql...');
    const sqlPath = path.join(__dirname, 'database.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar o script SQL
    console.log('⚙️  Executando script SQL...');
    await connection.query(sqlScript);
    
    console.log('✅ Script SQL executado com sucesso!\n');
    
    // Verificar se o banco foi criado
    const [databases] = await connection.query(
      'SHOW DATABASES LIKE ?',
      [process.env.DB_NAME]
    );
    
    if (databases.length > 0) {
      console.log(`✅ Banco de dados '${process.env.DB_NAME}' criado/verificado!`);
    }
    
    // Verificar se a tabela foi criada
    await connection.query(`USE ${process.env.DB_NAME}`);
    const [tables] = await connection.query('SHOW TABLES');
    
    console.log('\n📊 Tabelas criadas:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });
    
    console.log('\n✅ Setup concluído com sucesso!');
    console.log('\n💡 Próximo passo: Execute "npm run seed" para popular o banco\n');
    
  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error.message);
    console.error('\n💡 Verifique:');
    console.error('   - MySQL está rodando?');
    console.error('   - Credenciais no .env estão corretas?');
    console.error('   - Porta do MySQL está correta? (padrão: 3306)');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexão encerrada');
    }
  }
}

// Executar
setupDatabase();
