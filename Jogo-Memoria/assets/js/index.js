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

// Atualiza o placar na tela
function atualizarPlacar() {
  pontuacaoTexto.textContent = "PONTUAÇÃO: " + pontuacao;
  tentativasTexto.textContent = "NUMERO DE TENTATIVAS: " + tentativas;
}

// Função para embaralhar as cartas
function embaralharCartas() {
  // Pega todas as imagens (src)
  const srcs = Array.from(imagens).map(img => img.getAttribute("src"));

  // Algoritmo Fisher-Yates (embaralhamento)
  for (let i = srcs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];
  }

  // Aplica o novo embaralhamento nas imagens
  imagens.forEach((img, index) => {
    img.setAttribute("src", srcs[index]);
    img.style.visibility = "hidden"; // esconde novamente
  });
}

// Adiciona evento de clique em cada carta
cartas.forEach((carta, index) => {
  carta.addEventListener("click", () => {

    // Impede jogadas inválidas
    if (bloqueado) return; // se estiver bloqueado
    if (index === primeiroIndex) return; // mesma carta
    if (imagens[index].style.visibility === "visible") return; // já aberta

    // Mostra a carta
    imagens[index].style.visibility = "visible";

    // Se for a primeira carta clicada
    if (!primeiraCarta) {
      primeiraCarta = carta;
      primeiroIndex = index;
      return;
    }

    // Se for a segunda carta
    segundaCarta = carta;
    segundoIndex = index;

    // Conta tentativa
    tentativas++;
    atualizarPlacar();

    // Verifica se formou par
    verificarPar();
  });
});

// Função para verificar se as duas cartas são iguais
function verificarPar() {
  const img1 = imagens[primeiroIndex].getAttribute("src");
  const img2 = imagens[segundoIndex].getAttribute("src");

  // Se forem iguais
  if (img1 === img2) {
    pontuacao++; // ganha ponto
    atualizarPlacar();
    resetarEscolha(); // limpa seleção
  } else {
    // Se forem diferentes
    pontuacao = Math.max(0, pontuacao - 1); // perde ponto sem ficar negativo
    bloqueado = true; // bloqueia o jogo temporariamente

    // Espera 1 segundo e vira as cartas de volta
    setTimeout(() => {
      imagens[primeiroIndex].style.visibility = "hidden";
      imagens[segundoIndex].style.visibility = "hidden";

      resetarEscolha(); // limpa seleção
    }, 1000);
  }

  atualizarPlacar();
}

// Reseta as escolhas do jogador
function resetarEscolha() {
  primeiraCarta = null;
  segundaCarta = null;
  primeiroIndex = null;
  segundoIndex = null;
  bloqueado = false;
}

// Evento do botão de reset
botaoReset.addEventListener("click", () => {

  // Esconde todas as cartas
  imagens.forEach((img) => {
    img.style.visibility = "hidden";
  });

  // Zera pontuação e tentativas
  pontuacao = 0;
  tentativas = 0;

  // Reinicia o jogo
  embaralharCartas();
  atualizarPlacar();
  resetarEscolha();
});

// Inicialização do jogo
embaralharCartas(); // embaralha ao iniciar
atualizarPlacar();  // mostra placar inicial
