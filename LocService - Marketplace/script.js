// script.js — interações globais + sistema de login

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
// SISTEMA DE LOGIN
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

// Função de login com usuarios.txt
function fazerLogin(email, senha) {
  fetch('usuarios.txt')
  .then(response => response.text())
  .then(conteudo => {
    const linhas = conteudo.split('\n');
    let encontrado = false;
    let nomeUsuario = '';
    
    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (linha === '') continue;
      
      const dados = linha.split(',');
      const nome = dados[0];
      const emailArquivo = dados[1];
      const senhaArquivo = dados[2];
      
      if (emailArquivo === email && senhaArquivo === senha) {
        encontrado = true;
        nomeUsuario = nome;
        break;
      }
    }
    
    if (encontrado) {
      alert('Bem-vindo, ' + nomeUsuario + '!');
      sessionStorage.setItem('usuarioLogado', nomeUsuario);
      sessionStorage.setItem('emailLogado', email);
      window.location.href = 'index.html';
    } else {
      alert('Email ou senha incorretos!');
    }
  })
  .catch(() => alert('Erro ao carregar dados de login. Certifique-se que o arquivo usuarios.txt existe.'));
}

// Verifica se está na página index
if (window.location.pathname.includes("index") || window.location.pathname === '/' || window.location.pathname === '/index.html') {
  verificarUsuarioLogado();
}

// Verifica se usuário está logado
function verificarUsuarioLogado() {
  const usuarioLogado = sessionStorage.getItem('usuarioLogado');
  const emailLogado = sessionStorage.getItem('emailLogado');
  
  if (usuarioLogado) {
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');
    
    if (btnLogin) btnLogin.style.display = 'none';
    if (btnCadastro) btnCadastro.style.display = 'none';
    
    const isAdmin = (emailLogado === 'admin@locservice.com');
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

// ===== LOGOUT =====

function fazerLogout() {
  if (confirm('Deseja realmente sair?')) {
    sessionStorage.clear();
    alert('Logout realizado com sucesso!');
    window.location.reload();
  }
}
