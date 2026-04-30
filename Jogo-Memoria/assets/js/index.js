const cartas = document.querySelectorAll(".Cartas div"); 
const imagens = document.querySelectorAll(".imagens img");

const pontuacaoTexto = document.querySelector(".Pontuacao");
const tentativasTexto = document.querySelector(".Numero-tentativas");
const botaoReset = document.querySelector("button");

let primeiraCarta = null;
let segundaCarta = null;

let primeiroIndex = null;
let segundoIndex = null;

let bloqueado = false;

let pontuacao = 0;
let tentativas = 0;

imagens.forEach((img) => {
  img.style.visibility = "hidden";
});

function atualizarPlacar() {
  pontuacaoTexto.textContent = "PONTUAÇÃO: " + pontuacao;
  tentativasTexto.textContent = "NUMERO DE TENTATIVAS: " + tentativas;
}

//  FUNÇÃO para embaralhar as cartas
function embaralharCartas() {
  const srcs = Array.from(imagens).map(img => img.getAttribute("src"));

  for (let i = srcs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [srcs[i], srcs[j]] = [srcs[j], srcs[i]];
  }
  imagens.forEach((img, index) => {
    img.setAttribute("src", srcs[index]);
    img.style.visibility = "hidden";
  });
}

cartas.forEach((carta, index) => {
  carta.addEventListener("click", () => {
    if (bloqueado) return;
    if (index === primeiroIndex) return;
    if (imagens[index].style.visibility === "visible") return;

    imagens[index].style.visibility = "visible";

    if (!primeiraCarta) {
      primeiraCarta = carta;
      primeiroIndex = index;
      return;
    }

    segundaCarta = carta;
    segundoIndex = index;

    tentativas++;
    atualizarPlacar();

    verificarPar();
  });
});

function verificarPar() {
  const img1 = imagens[primeiroIndex].getAttribute("src");
  const img2 = imagens[segundoIndex].getAttribute("src");

  if (img1 === img2) {
    pontuacao++;
    atualizarPlacar();
    resetarEscolha();
  } else {
     pontuacao = Math.max(0, pontuacao - 1);
     bloqueado = true ;
    
    setTimeout(() => {
      imagens[primeiroIndex].style.visibility = "hidden";
      imagens[segundoIndex].style.visibility = "hidden";

      resetarEscolha();
    }, 1000);
  }

    atualizarPlacar();

  if (img1 === img2) {
    resetarEscolha();
  }
}

function resetarEscolha() {
  primeiraCarta = null;
  segundaCarta = null;
  primeiroIndex = null;
  segundoIndex = null;
  bloqueado = false;
}

botaoReset.addEventListener("click", () => {
  imagens.forEach((img) => {
    img.style.visibility = "hidden";
  });

  pontuacao = 0;
  tentativas = 0;


  embaralharCartas();
  atualizarPlacar();
  resetarEscolha();
});

embaralharCartas();
atualizarPlacar();
