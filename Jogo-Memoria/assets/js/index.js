// Seleciona todas as cartas (divs clicáveis)
const cartas = document.querySelectorAll(".Cartas div"); 

// Seleciona todas as imagens das cartas
const imagens = document.querySelectorAll(".imagens img");

// Elementos do placar
const pontuacaoTexto = document.querySelector(".Pontuacao");
const tentativasTexto = document.querySelector(".Numero-tentativas");

// Botão de reset
const botaoReset = document.querySelector("button");

// Variáveis para armazenar as cartas selecionadas
let primeiraCarta = null;
let segundaCarta = null;

// Índices das cartas selecionadas
let primeiroIndex = null;
let segundoIndex = null;

// Controla se o jogo está bloqueado (evita cliques durante animação)
let bloqueado = false;

// Pontuação e tentativas
let pontuacao = 0;
let tentativas = 0;

// Esconde todas as imagens no início do jogo
imagens.forEach((img) => {
  img.style.visibility = "hidden";
});

// ---------------- FUNÇÃO: atualizarPlacar ----------------
// Atualiza os textos de pontuação e tentativas na tela
function atualizarPlacar() {
  pontuacaoTexto.textContent = "PONTUAÇÃO: " + pontuacao;
  tentativasTexto.textContent = "NUMERO DE TENTATIVAS: " + tentativas;
}

// ---------------- FUNÇÃO: embaralharCartas ----------------
// Responsável por embaralhar as imagens das cartas
function embaralharCartas() {
  // Cria um array com os caminhos (src) das imagens
  const srcs = Array.from(imagens).map(img => img.getAttribute("src"));

  // Algoritmo Fisher-Yates (embaralhamento aleatório eficiente)
  for (let i = srcs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // Troca os elementos de posição
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];
  }

  // Aplica o embaralhamento nas imagens do jogo
  imagens.forEach((img, index) => {
    img.setAttribute("src", srcs[index]);

    // Esconde todas as cartas novamente após embaralhar
    img.style.visibility = "hidden";
  });
}

// ---------------- EVENTO DE CLIQUE NAS CARTAS ----------------
cartas.forEach((carta, index) => {
  carta.addEventListener("click", () => {

    // Impede jogadas inválidas
    if (bloqueado) return; // bloqueia durante animação
    if (index === primeiroIndex) return; // evita clicar na mesma carta
    if (imagens[index].style.visibility === "visible") return; // evita carta já aberta

    // Mostra a carta clicada
    imagens[index].style.visibility = "visible";

    // Se ainda não existe primeira carta selecionada
    if (!primeiraCarta) {
      primeiraCarta = carta;     // guarda a carta
      primeiroIndex = index;     // guarda o índice
      return; // espera a segunda carta
    }

    // Se já existe primeira carta, essa é a segunda
    segundaCarta = carta;
    segundoIndex = index;

    // Incrementa o número de tentativas
    tentativas++;
    atualizarPlacar();

    // Verifica se as cartas formam um par
    verificarPar();
  });
});

// ---------------- FUNÇÃO: verificarPar ----------------
// Verifica se as duas cartas escolhidas são iguais
function verificarPar() {
  // Pega o caminho das imagens selecionadas
  const img1 = imagens[primeiroIndex].getAttribute("src");
  const img2 = imagens[segundoIndex].getAttribute("src");

  // Caso sejam iguais (acertou o par)
  if (img1 === img2) {
    pontuacao++; // ganha ponto
    atualizarPlacar();

    // Limpa seleção para próxima jogada
    resetarEscolha();

  } else {
    // Caso sejam diferentes (errou)
    pontuacao = Math.max(0, pontuacao - 1); // perde ponto sem ficar negativo

    bloqueado = true; // bloqueia o jogo temporariamente

    // Espera 1 segundo antes de esconder as cartas novamente
    setTimeout(() => {
      imagens[primeiroIndex].style.visibility = "hidden";
      imagens[segundoIndex].style.visibility = "hidden";

      // Libera o jogo para próxima jogada
      resetarEscolha();
    }, 1000);
  }

  // Atualiza o placar depois da verificação
  atualizarPlacar();
}

// ---------------- FUNÇÃO: resetarEscolha ----------------
// Limpa todas as variáveis de seleção
function resetarEscolha() {
  primeiraCarta = null;
  segundaCarta = null;
  primeiroIndex = null;
  segundoIndex = null;
  bloqueado = false; // desbloqueia o jogo
}

// ---------------- EVENTO DO BOTÃO RESET ----------------
botaoReset.addEventListener("click", () => {

  // Esconde todas as cartas novamente
  imagens.forEach((img) => {
    img.style.visibility = "hidden";
  });

  // Reseta pontuação e tentativas
  pontuacao = 0;
  tentativas = 0;

  // Reinicia o jogo
  embaralharCartas();
  atualizarPlacar();
  resetarEscolha();
});

// ---------------- INICIALIZAÇÃO DO JOGO ----------------

// Embaralha as cartas ao iniciar
embaralharCartas();

// Atualiza o placar inicial (0 pontos, 0 tentativas)
atualizarPlacar();
