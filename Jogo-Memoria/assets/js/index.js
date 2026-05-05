// ─────────────────────────────────────────────────────────
// SELEÇÃO DE ELEMENTOS DO DOM
// Captura todos os elementos necessários da página HTML
// ─────────────────────────────────────────────────────────
const cartas = document.querySelectorAll(".Cartas div");               // Todas as divs clicáveis (frente das cartas)
const imagens = document.querySelectorAll(".imagens img");             // Todas as imagens (verso das cartas)
const pontuacaoTexto = document.querySelector(".Pontuacao");           // Elemento que exibe a pontuação
const tentativasTexto = document.querySelector(".Numero-tentativas");  // Elemento que exibe o nº de tentativas
const botaoReset = document.querySelector("button");                   // Botão para reiniciar o jogo

// ─────────────────────────────────────────────────────────
// VARIÁVEIS DE ESTADO DO JOGO
// Guardam a situação atual da partida a cada jogada
// ─────────────────────────────────────────────────────────
let primeiraCarta  = null;   // Referência à 1ª carta clicada
let segundaCarta   = null;   // Referência à 2ª carta clicada
let primeiroIndex  = null;   // Índice da 1ª carta (para acessar a imagem correspondente)
let segundoIndex   = null;   // Índice da 2ª carta
let bloqueado      = false;  // Trava cliques enquanto o par errado está sendo exibido
let pontuacao      = 0;      // Contador de acertos
let tentativas     = 0;      // Contador de tentativas totais

// ─────────────────────────────────────────────────────────
// INICIALIZAÇÃO: Esconde todas as imagens ao carregar
// ─────────────────────────────────────────────────────────
imagens.forEach((img) => {
  img.style.visibility = "hidden"; // Cada imagem começa invisível (carta "virada para baixo")
});

// ─────────────────────────────────────────────────────────
// FUNÇÃO: atualizarPlacar()
// Atualiza o texto de pontuação e tentativas na tela
// ─────────────────────────────────────────────────────────
function atualizarPlacar() {
  pontuacaoTexto.textContent  = "PONTUAÇÃO: "           + pontuacao;  // Mostra a pontuação atual
  tentativasTexto.textContent = "NUMERO DE TENTATIVAS: " + tentativas; // Mostra quantas tentativas foram feitas
}

// ─────────────────────────────────────────────────────────
// FUNÇÃO: embaralharCartas()
// Embaralha a ordem das imagens usando o algoritmo Fisher-Yates
// Garante que cada rodada tenha disposição diferente
// ─────────────────────────────────────────────────────────
function embaralharCartas() {
  const srcs = Array.from(imagens).map(img => img.getAttribute("src")); // Cria array com todos os "src" das imagens

  for (let i = srcs.length - 1; i > 0; i--) {          // Percorre do fim ao início
    const j = Math.floor(Math.random() * (i + 1));     // Escolhe posição aleatória entre 0 e i
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];            // Troca os dois valores de posição (destructuring)
  }

  imagens.forEach((img, index) => {
    img.setAttribute("src", srcs[index]);              // Aplica a nova ordem embaralhada às imagens
    img.style.visibility = "hidden";                  // Garante que todas comecem escondidas
  });
}

// ─────────────────────────────────────────────────────────
// EVENTO DE CLIQUE NAS CARTAS
// Controla toda a lógica de seleção de pares
// ─────────────────────────────────────────────────────────
cartas.forEach((carta, index) => {
  carta.addEventListener("click", () => {

    if (bloqueado) return;                                        // Impede cliques enquanto o par errado ainda está visível
    if (index === primeiroIndex) return;                           // Impede clicar na mesma carta duas vezes
    if (imagens[index].style.visibility === "visible") return;    // Ignora cartas já encontradas (par correto)

    imagens[index].style.visibility = "visible";               // Revela a imagem da carta clicada

    if (!primeiraCarta) {                 // Se ainda não há 1ª carta selecionada...
      primeiraCarta = carta;             // Salva a referência da carta
      primeiroIndex = index;             // Salva o índice para comparar depois
      return;                           // Para aqui — aguarda o 2º clique
    }

    // Chegou aqui: é o 2º clique
    segundaCarta  = carta;              // Salva a 2ª carta
    segundoIndex  = index;              // Salva o índice da 2ª carta
    tentativas++;                       // Contabiliza a tentativa
    atualizarPlacar();                  // Atualiza o placar na tela
    verificarPar();                     // Verifica se as duas cartas formam um par
  });
});

// ─────────────────────────────────────────────────────────
// FUNÇÃO: verificarPar()
// Compara as imagens das duas cartas selecionadas
// Acerto → pontua | Erro → desconta e esconde após 1 segundo
// ─────────────────────────────────────────────────────────
function verificarPar() {
  const img1 = imagens[primeiroIndex].getAttribute("src"); // Pega o src da 1ª imagem
  const img2 = imagens[segundoIndex].getAttribute("src");  // Pega o src da 2ª imagem

  if (img1 === img2) {                         // As imagens são iguais → par encontrado!
    pontuacao++;                               // Incrementa a pontuação
    atualizarPlacar();                         // Atualiza na tela
    resetarEscolha();                          // Limpa a seleção para próxima jogada
  } else {                                     // Imagens diferentes → par errado
    pontuacao = Math.max(0, pontuacao - 1);   // Desconta 1 ponto (mínimo 0, nunca negativo)
    bloqueado = true;                          // Trava os cliques durante o delay
    setTimeout(() => {                         // Aguarda 1 segundo para o jogador ver as cartas
      imagens[primeiroIndex].style.visibility = "hidden"; // Esconde a 1ª carta
      imagens[segundoIndex].style.visibility  = "hidden"; // Esconde a 2ª carta
      resetarEscolha();                                   // Libera os cliques e limpa a seleção
    }, 1000);
  }

  atualizarPlacar(); // Atualiza o placar (cobre o caso do desconto de pontos)
}

// ─────────────────────────────────────────────────────────
// FUNÇÃO: resetarEscolha()
// Limpa as variáveis de seleção após cada tentativa
// Prepara o jogo para a próxima jogada
// ─────────────────────────────────────────────────────────
function resetarEscolha() {
  primeiraCarta = null;   // Apaga referência da 1ª carta
  segundaCarta  = null;   // Apaga referência da 2ª carta
  primeiroIndex = null;   // Apaga o índice da 1ª carta
  segundoIndex  = null;   // Apaga o índice da 2ª carta
  bloqueado     = false;  // Destrava os cliques
}

// ─────────────────────────────────────────────────────────
// EVENTO DO BOTÃO RESET
// Reinicia o jogo completamente: zera placar, embaralha
// ─────────────────────────────────────────────────────────
botaoReset.addEventListener("click", () => {
  imagens.forEach((img) => {
    img.style.visibility = "hidden"; // Esconde todas as imagens
  });
  pontuacao  = 0;          // Zera a pontuação
  tentativas = 0;          // Zera o contador de tentativas
  embaralharCartas();      // Reembaralha as imagens
  atualizarPlacar();       // Atualiza o placar zerado na tela
  resetarEscolha();        // Garante que nenhuma carta fique selecionada
});

// ─────────────────────────────────────────────────────────
// INICIALIZAÇÃO DO JOGO ao carregar a página
// ─────────────────────────────────────────────────────────
embaralharCartas(); // Embaralha as cartas na primeira carga
atualizarPlacar();  // Exibe o placar inicial (0 pontos, 0 tentativas)
