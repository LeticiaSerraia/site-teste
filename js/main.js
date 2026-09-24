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

// Permite virar os cards ao tocar em dispositivos móveis (touch)
document.addEventListener('click', (e) => {
  const card = e.target.closest('.flip-card');
  if (card) {
    card.classList.toggle('flipped');
  }
});
/* =========================================================
   DESAFIO DO DETETIVE DIGITAL
========================================================= */

const kidsQuestions = [
  {
    emoji: "📸",

    question:
      "Um jogador que você não conhece pede uma foto sua. O que você faz?",

    options: [
      "📸 Envio a foto para ele.",
      "🛑 Não envio e conto para um adulto de confiança.",
      "🤫 Guardo segredo."
    ],

    correct: 1,

    feedback:
      "Muito bem! Pessoas desconhecidas não precisam receber suas fotos. Se algo parecer estranho, conte para um adulto de confiança."
  },

  {
    emoji: "🎁",

    question:
      "Alguém promete moedas grátis no seu jogo e manda um link. O que você faz?",

    options: [
      "🔗 Clico rapidamente.",
      "🎮 Passo minha senha para receber.",
      "🛑 Não clico e peço ajuda a um adulto."
    ],

    correct: 2,

    feedback:
      "Isso! Links de prêmios podem ser armadilhas para roubar contas ou informações."
  },

  {
    emoji: "🤫",

    question:
      "Uma pessoa online diz: 'Não conte para ninguém sobre nossa conversa'. O que você faz?",

    options: [
      "🤐 Prometo guardar segredo.",
      "🗣️ Conto para um adulto de confiança.",
      "👍 Continuo conversando normalmente."
    ],

    correct: 1,

    feedback:
      "Muito bem! Uma pessoa que pede para você esconder uma conversa de adultos de confiança merece atenção."
  },

  {
    emoji: "📍",

    question:
      "Uma pessoa que você conheceu na internet quer saber onde você mora. O que você faz?",

    options: [
      "📍 Passo meu endereço.",
      "🛑 Não informo e conto para um adulto.",
      "💬 Pergunto onde ela mora."
    ],

    correct: 1,

    feedback:
      "Correto! Seu endereço, escola e rotina são informações pessoais que devem ser protegidas."
  },

  {
    emoji: "😨",

    question:
      "Uma conversa na internet deixa você com medo ou desconfortável. O que você faz?",

    options: [
      "😶 Continuo sozinho.",
      "🔥 Apago tudo e não conto para ninguém.",
      "🛑 Paro a conversa e conto para um adulto de confiança."
    ],

    correct: 2,

    feedback:
      "Perfeito! Quando algo te deixa com medo ou desconfortável: PARE, SAIA DA CONVERSA E CONTE."
  }
];

let kidsCurrentQuestion = 0;
let kidsScore = 0;
let kidsAnswered = false;


/* =========================================================
   INICIAR JOGO
========================================================= */

function startKidsGame() {

  kidsCurrentQuestion = 0;

  kidsScore = 0;

  kidsAnswered = false;

  const result = document.getElementById("kids-result");
  const questionCard =
    document.querySelector(".kids-question-card");

  if (result) {
    result.style.display = "none";
  }

  if (questionCard) {
    questionCard.style.display = "block";
  }

  updateKidsQuestion();
}


/* =========================================================
   MOSTRAR PERGUNTA
========================================================= */

function updateKidsQuestion() {

  const question =
    kidsQuestions[kidsCurrentQuestion];

  if (!question) return;

  kidsAnswered = false;

  const situation =
    document.getElementById("kids-situation");

  const title =
    document.getElementById("kids-question");

  const questionNumber =
    document.getElementById("kids-question-number");

  const progress =
    document.getElementById("kids-progress-bar");

  const feedback =
    document.getElementById("kids-feedback");

  const score =
    document.getElementById("kids-score");

  situation.textContent = question.emoji;

  title.textContent = question.question;

  questionNumber.textContent =
    kidsCurrentQuestion + 1;

  score.textContent = kidsScore;

  progress.style.width =
    `${((kidsCurrentQuestion + 1) / kidsQuestions.length) * 100}%`;

  feedback.className = "kids-feedback";

  feedback.innerHTML = "";

  const buttons =
    document.querySelectorAll(".kids-option");

  buttons.forEach((button, index) => {

    button.disabled = false;

    button.style.opacity = "1";

    button.style.pointerEvents = "auto";

    button.innerHTML =
      `<span>${question.options[index]}</span>`;
  });
}


/* =========================================================
   RESPONDER
========================================================= */

function answerKids(answer) {

  if (kidsAnswered) return;

  kidsAnswered = true;

  const question =
    kidsQuestions[kidsCurrentQuestion];

  const feedback =
    document.getElementById("kids-feedback");

  const buttons =
    document.querySelectorAll(".kids-option");

  buttons.forEach(button => {

    button.disabled = true;

    button.style.pointerEvents = "none";
  });


  if (answer === question.correct) {

    kidsScore++;

    feedback.className =
      "kids-feedback correct";

    feedback.innerHTML =
      `🌟 <strong>Muito bem!</strong><br>${question.feedback}`;

  } else {

    feedback.className =
      "kids-feedback wrong";

    feedback.innerHTML =
      `💡 <strong>Quase!</strong><br>${question.feedback}`;
  }


  document.getElementById(
    "kids-score"
  ).textContent = kidsScore;


  setTimeout(() => {

    kidsCurrentQuestion++;

    if (
      kidsCurrentQuestion <
      kidsQuestions.length
    ) {

      updateKidsQuestion();

    } else {

      finishKidsGame();

    }

  }, 2200);
}


/* =========================================================
   FINALIZAR
========================================================= */

function finishKidsGame() {

  const questionCard =
    document.querySelector(".kids-question-card");

  const result =
    document.getElementById("kids-result");

  const finalScore =
    document.getElementById("kids-final-score");

  const progress =
    document.getElementById("kids-progress-bar");

  questionCard.style.display = "none";

  result.style.display = "block";

  finalScore.textContent =
    `${kidsScore}/${kidsQuestions.length}`;

  progress.style.width = "100%";
}


/* =========================================================
   JOGAR NOVAMENTE
========================================================= */

function restartKidsGame() {

  const questionCard =
    document.querySelector(".kids-question-card");

  const result =
    document.getElementById("kids-result");

  questionCard.style.display = "block";

  result.style.display = "none";

  startKidsGame();
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      document.getElementById("kids-question")
    ) {

      startKidsGame();

    }

  }
);