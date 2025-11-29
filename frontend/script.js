// script.js — interações globais + sistema de login com API

const $ = (s) => document.querySelector(s);

// ===== MENU MOBILE =====
const btn = $(".nav-toggle");
const menu = $("#menu");
if (btn && menu) {
  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

// ===== ANO RODAPÉ =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== ANIMAÇÃO ON-SCROLL =====
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    }),
  { threshold: 0.15 }
);

document.querySelectorAll(".card, .glass, .company").forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(12px)";
  observer.observe(el);
});

const style = document.createElement("style");
style.textContent = `.in{opacity:1!important;transform:none!important;transition:.5s ease}`;
document.head.appendChild(style);

// ============================================================
// SISTEMA DE LOGIN COM API
// ============================================================

// Verifica se está na página de login
if (window.location.pathname.includes("login")) {
  const formLogin = document.querySelector("form");
  if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
      event.preventDefault();
      
      const email = document.querySelector('input[type="email"]');
      const senha = document.querySelector('input[type="password"]');
      
      if (email && senha) {
        if (!email.value.includes("@") || senha.value.length < 6) {
          alert("Preencha um e-mail válido e uma senha com pelo menos 6 caracteres.");
          return;
        }
        fazerLogin(email.value, senha.value);
      }
    });
  }
}

// ⭐ NOVA FUNÇÃO - Função de login usando API
async function fazerLogin(email, senha) {
  try {
    console.log('🔐 Tentando login via API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    console.log('📡 Resposta recebida:', response.status);

    const data = await response.json();
    console.log('📦 Dados:', data);

    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('usuarioLogado', data.data.usuario.nome);
      localStorage.setItem('emailLogado', data.data.usuario.email);
      // ⭐ Converte para string 'true' ou 'false'
      localStorage.setItem('isAdmin', data.data.usuario.isAdmin ? 'true' : 'false');
      
      alert(data.message);
      window.location.href = 'index.html';
    } else {
      alert(data.message || 'Email ou senha incorretos!');
    }
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    alert('Erro ao conectar com o servidor!\n\nVerifique se:\n✅ O backend está rodando (npm run dev)\n✅ Está acessando via http://localhost ou http://127.0.0.1');
  }
}

// Verifica se está na página index
if (window.location.pathname.includes("index") || window.location.pathname === '/' || window.location.pathname === '/index.html') {
  verificarUsuarioLogado();
}

// ⭐ ATUALIZADA - Verifica se usuário está logado
function verificarUsuarioLogado() {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  const emailLogado = localStorage.getItem('emailLogado');
  // ⭐ Aceita 'true', '1', ou boolean true
  const isAdminValue = localStorage.getItem('isAdmin');
  const isAdmin = isAdminValue === 'true' || isAdminValue === '1' || isAdminValue === true;
  
  console.log('🔍 Debug isAdmin:', isAdminValue, '→', isAdmin); // Para debug
  
  if (usuarioLogado) {
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');
    
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnCadastro) btnCadastro.style.display = 'none';
    
    criarMenuUsuario(usuarioLogado, emailLogado, isAdmin);
  }
}

// Cria menu de usuário (bolinha)
function criarMenuUsuario(nome, email, isAdmin) {
  const menuContainer = document.createElement('div');
  menuContainer.className = 'menu-usuario-container';
  
  const bolinha = document.createElement('div');
  bolinha.className = 'bolinha-usuario';
  bolinha.textContent = nome.charAt(0).toUpperCase();
  bolinha.title = nome;
  
  if (isAdmin) {
    bolinha.style.background = 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)';
  }
  
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown-menu';
  
  if (isAdmin) {
    dropdown.innerHTML = `
      <div class="dropdown-header" style="background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);">
        <strong>👑 ${nome} (Admin)</strong>
        <small>${email}</small>
      </div>
      <hr>
      <a href="#" onclick="editarCards(); return false;">✏️ Editar Cards</a>
      <a href="#" onclick="verRelatorios(); return false;">📊 Relatórios</a>
      <a href="#" onclick="gerenciarUsuarios(); return false;">👥 Gerenciar Usuários</a>
      <a href="#" onclick="verConfiguracoes(); return false;">⚙️ Configurações</a>
      <hr>
      <a href="#" onclick="fazerLogout(); return false;" style="color: #f44336;">🚪 Sair</a>
    `;
  } else {
    dropdown.innerHTML = `
      <div class="dropdown-header">
        <strong>${nome}</strong>
        <small>${email}</small>
      </div>
      <hr>
      <a href="#" onclick="irParaPerfil(); return false;">👤 Meu Perfil</a>
      <a href="#" onclick="verPedidos(); return false;">📋 Meus Pedidos</a>
      <a href="#" onclick="verFavoritos(); return false;">⭐ Favoritos</a>
      <a href="#" onclick="verNotificacoes(); return false;">🔔 Notificações</a>
      <a href="#" onclick="verConfiguracoes(); return false;">⚙️ Configurações</a>
      <hr>
      <a href="#" onclick="fazerLogout(); return false;" style="color: #f44336;">🚪 Sair</a>
    `;
  }
  
  bolinha.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });
  
  document.addEventListener('click', function(e) {
    if (!menuContainer.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
  
  menuContainer.appendChild(bolinha);
  menuContainer.appendChild(dropdown);
  document.body.appendChild(menuContainer);
}

// ===== FUNÇÕES DO MENU - USUÁRIO NORMAL =====

function irParaPerfil() {
  alert('Funcionalidade: Meu Perfil (em desenvolvimento)');
}

function verPedidos() {
  alert('Funcionalidade: Meus Pedidos (em desenvolvimento)');
}

function verFavoritos() {
  alert('Funcionalidade: Favoritos (em desenvolvimento)');
}

function verNotificacoes() {
  alert('Funcionalidade: Notificações (em desenvolvimento)');
}

function verConfiguracoes() {
  alert('Funcionalidade: Configurações (em desenvolvimento)');
}

// ===== FUNÇÕES DO MENU - ADMIN =====

function editarCards() {
  alert('Funcionalidade: Editar Cards (em desenvolvimento)');
}

function verRelatorios() {
  alert('Funcionalidade: Relatórios (em desenvolvimento)');
}

function gerenciarUsuarios() {
  alert('Funcionalidade: Gerenciar Usuários (em desenvolvimento)');
}

// ⭐ ATUALIZADA - LOGOUT
function fazerLogout() {
  if (confirm('Deseja realmente sair?')) {
    // ⭐ MUDANÇA: Limpa localStorage (não sessionStorage)
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('emailLogado');
    localStorage.removeItem('isAdmin');
    
    alert('Logout realizado com sucesso!');
    window.location.href = 'login.html';
  }
}
