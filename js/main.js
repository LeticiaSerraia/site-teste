// Aguarda a página carregar completamente antes de iniciar funcionalidades base
document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();
});

// Navegação por Abas com preservação de estado visual
function switchTab(tabId) {
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const activeSection = document.getElementById('tab-' + tabId);
  const activeBtn = document.getElementById('btn-' + tabId);

  if (activeSection) activeSection.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// LÓGICA DO QUIZ (Dados extraídos do Relatório Técnico)
const quizData = [
  {
    q: "Segundo dados de pesquisas nacionais do projeto, qual faixa etária lidera a parcela de vítimas de golpes virtuais no Brasil (27%)?",
    opts: [
      { t: "Jovens entre 16 e 29 anos", c: true },
      { t: "Idosos acima de 75 anos", c: false },
      { t: "Crianças em fase escolar", c: false }
    ],
    exp: "Exato! Contrariando o senso comum, jovens entre 16 e 29 anos são os mais atingidos (27%) por realizarem mais transações imediatas na rede."
  },
  {
    q: "Você recebe um áudio no WhatsApp com a voz idêntica à de um familiar pedindo dinheiro com urgência de um número desconhecido. Qual a postura recomendada?",
    opts: [
      { t: "Fazer o Pix imediato para evitar riscos ao familiar", c: false },
      { t: "Desligar e ligar de volta para o número original já salvo desse familiar", c: true },
      { t: "Pedir os dados do cartão de crédito dele para confirmar", c: false }
    ],
    exp: "Correto! Criminosos usam ferramentas de inteligência artificial para clonar vozes a partir de postagens na web. Sempre confirme pelo número oficial."
  },
  {
    q: "O que deve ser feito se você for alvo de chantagem com vazamento ou deepfake de fotos íntimas?",
    opts: [
      { t: "Pagar o valor solicitado para encerrar o problema rapidamente", c: false },
      { t: "Apagar todas as mensagens para esquecer o ocorrido", c: false },
      { t: "Preservar prints/provas e denunciar nos canais oficiais (Ligue 180, Delegacia)", c: true }
    ],
    exp: "Correto! Pagar chantagistas não garante a interrupção das ameaças. Guarde todas as evidências com data e procure a polícia e o Ligue 180."
  }
];

let currentQ = 0;

function renderQuiz() {
  const q = quizData[currentQ];
  const qElement = document.getElementById('quiz-q');
  
  // Evita erro caso esteja numa página sem o Quiz
  if(!qElement) return;

  qElement.textContent = (currentQ + 1) + ". " + q.q;
  const optsContainer = document.getElementById('quiz-opts');
  optsContainer.innerHTML = '';
  
  const feed = document.getElementById('quiz-feed');
  feed.style.display = 'none';

  q.opts.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.textContent = option.t;
    btn.onclick = () => checkQuiz(option.c, q.exp);
    optsContainer.appendChild(btn);
  });
}

function checkQuiz(isCorrect, explanation) {
  const feed = document.getElementById('quiz-feed');
  feed.style.display = 'block';

  if (isCorrect) {
    feed.style.backgroundColor = 'var(--success-bg)';
    feed.style.color = 'var(--success)';
    feed.style.border = '1px solid var(--success)';
    feed.innerHTML = `<strong>✔ Correto!</strong> ${explanation}`;
  } else {
    feed.style.backgroundColor = 'var(--danger-bg)';
    feed.style.color = 'var(--danger)';
    feed.style.border = '1px solid var(--danger)';
    feed.innerHTML = `<strong>✖ Atenção!</strong> Essa atitude expõe você a perigos ou fraudes. Acompanhe as orientações do portal.`;
  }

  setTimeout(() => {
    currentQ = (currentQ + 1) % quizData.length;
    renderQuiz();
  }, 4000);
}

// LÓGICA DO TESTADOR DE SENHAS
function evaluatePassword() {
  const val = document.getElementById('inputPass').value;
  const meter = document.getElementById('meter-fill');
  const verdict = document.getElementById('passVerdict');

  if (!val) {
    meter.style.width = '0%';
    verdict.textContent = 'Digite uma senha';
    verdict.style.color = '#fff';
    updateCheck('rule-len', false);
    updateCheck('rule-upper', false);
    updateCheck('rule-lower', false);
    updateCheck('rule-num', false);
    updateCheck('rule-sym', false);
    return;
  }

  let score = 0;
  const len = val.length >= 8;
  const upper = /[A-Z]/.test(val);
  const lower = /[a-z]/.test(val);
  const num = /[0-9]/.test(val);
  const sym = /[^A-Za-z0-9]/.test(val);

  if (len) score++;
  if (upper) score++;
  if (lower) score++;
  if (num) score++;
  if (sym) score++;

  updateCheck('rule-len', len);
  updateCheck('rule-upper', upper);
  updateCheck('rule-lower', lower);
  updateCheck('rule-num', num);
  updateCheck('rule-sym', sym);

  const common = ['123456', 'password', 'qwerty', 'senha', '12345678'];
  if (common.includes(val.toLowerCase())) score = 1;

  if (score <= 2) {
    meter.style.width = '30%';
    meter.style.background = '#f87171';
    verdict.textContent = '🔴 Senha Fraca';
    verdict.style.color = '#f87171';
  } else if (score <= 4) {
    meter.style.width = '65%';
    meter.style.background = '#fbbf24';
    verdict.textContent = '🟡 Senha Média';
    verdict.style.color = '#fbbf24';
  } else {
    meter.style.width = '100%';
    meter.style.background = '#4ade80';
    verdict.textContent = '🟢 Senha Forte';
    verdict.style.color = '#4ade80';
  }
}

function updateCheck(id, ok) {
  const el = document.getElementById(id);
  const label = el.textContent.substring(2);
  el.textContent = (ok ? '✅ ' : '⚪ ') + label;
  el.style.color = ok ? '#4ade80' : '#94a3b8';
}

function togglePassView() {
  const input = document.getElementById('inputPass');
  const btn = document.getElementById('toggleBtn');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function generateStrongPass() {
  const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowers = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  const all = uppers + lowers + numbers + symbols;

  let pass = "";
  pass += uppers[Math.floor(Math.random() * uppers.length)];
  pass += lowers[Math.floor(Math.random() * lowers.length)];
  pass += numbers[Math.floor(Math.random() * numbers.length)];
  pass += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 10; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }

  pass = pass.split('').sort(() => 0.5 - Math.random()).join('');

  const input = document.getElementById('inputPass');
  input.value = pass;
  input.type = 'text';
  document.getElementById('toggleBtn').textContent = '🙈';
  evaluatePassword();

  const box = document.getElementById('passBox');
  box.style.display = 'block';
  box.innerHTML = '🔐 Senha gerada:<br><span style="font-size:1.1rem; color:#fff;">' + pass + '</span>';
}