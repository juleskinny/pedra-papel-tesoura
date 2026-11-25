import { verificarVencedor, escolhaAleatoriaInimigo, REGRAS, OPCOES, placar } from "./script.js";

let somAtivo = true;

const somDerrota = new Audio('./assets/musica e efeitos de som/lose-audio.m4a');
const somVitoria = new Audio('./assets/musica e efeitos de som/win-audio.mp3');
const somEmpate = new Audio('./assets/musica e efeitos de som/empate-audio.mp3');

function pararSons() {
    somDerrota.pause();
    somEmpate.pause();
    somVitoria.pause();

    somDerrota.currentTime = 0;
    somEmpate.currentTime = 0;
    somVitoria.currentTime = 0;
}

function tocarSom(som) {
    if (somAtivo) {
        pararSons();
        som.play();
    }
}

const resetarPlacar = document.querySelector('#button-restart');
const buttonSound = document.querySelector('#button-sound');
const buttonsoundOff = document.querySelector('#button-sound img');

const painelChoices = document.querySelector('.painel-choices');
const cardsChoices = Array.from(painelChoices.children);

const imgChoiceUser = document.querySelector('#img-choice-usuario');
const imgChoiceEnemy = document.querySelector('#img-choice-cpu');

const resultMsg = document.querySelector('#result-msg');
const emojiResultado = document.querySelector('#emoji-resultado');

const scoreUser = document.querySelector('#score-user');
const scoreCpu = document.querySelector("#score-cpu");

const cardUsuario = document.querySelector('#card-usuario');
const cardCpu = document.querySelector('#card-cpu');

// Recuperar placar salvo
const placarSalvo = JSON.parse(localStorage.getItem('placar'));

if (placarSalvo) {
    placar.jogador = placarSalvo.jogador ?? 0;
    placar.inimigo = placarSalvo.inimigo ?? 0;
    placar.empates = placarSalvo.empates ?? 0;
}

// Mostrar pontuação
scoreUser.textContent = placar.jogador;
scoreCpu.textContent = placar.inimigo;

// Salvar pontuação
function salvarPlacar() {
    localStorage.setItem('placar', JSON.stringify({
        jogador: placar.jogador,
        inimigo: placar.inimigo,
        empates: placar.empates
    }));
}

// Limpar emoji sem deixar imagem quebrada
function limparEmoji() {
    emojiResultado.removeAttribute('src');
    emojiResultado.hidden = true;
}

// Estado da rodada atual
let rodadaAtual = null;

function atualizarImagemJogada(cpuChoice, userChoice) {

    switch (cpuChoice) {
        case 'tesoura':
            imgChoiceEnemy.src = './assets/icons/scissors_2702-fe0f.png';
            break;

        case 'pedra':
            imgChoiceEnemy.src = './assets/icons/rock_1faa8.png';
            break;

        case 'papel':
            imgChoiceEnemy.src = './assets/icons/paper_1f4c4.png';
            break;

        default:
            break;
    }

    switch (userChoice) {
        case 'tesoura':
            imgChoiceUser.src = './assets/icons/scissors_2702-fe0f.png';
            break;

        case 'pedra':
            imgChoiceUser.src = './assets/icons/rock_1faa8.png';
            break;

        case 'papel':
            imgChoiceUser.src = './assets/icons/paper_1f4c4.png';
            break;

        default:
            break;
    }
}

function aplicarEfeitoResultado(result) {

    switch (result) {

        case "Você venceu a rodada":

            emojiResultado.src = './assets/icons/emoji-win.png';
            emojiResultado.hidden = false;

            resultMsg.classList.remove('msg-empate', 'msg-miss');
            resultMsg.classList.add('msg-win');

            cardUsuario.classList.remove('card-miss');
            cardUsuario.classList.add('card-win');

            cardCpu.classList.remove('card-win');
            cardCpu.classList.add('card-miss');

            tocarSom(somVitoria);

            break;

        case "Cpu venceu a rodada":

            emojiResultado.src = './assets/icons/cpu-win-emoji.png';
            emojiResultado.hidden = false;

            resultMsg.classList.remove('msg-empate', 'msg-win');
            resultMsg.classList.add('msg-miss');

            cardUsuario.classList.remove('card-win');
            cardUsuario.classList.add('card-miss');

            cardCpu.classList.remove('card-miss');
            cardCpu.classList.add('card-win');

            tocarSom(somDerrota);

            break;

        default:

            emojiResultado.src = './assets/icons/emjoi-empate.png';
            emojiResultado.hidden = false;

            resultMsg.classList.remove('msg-miss', 'msg-win');
            resultMsg.classList.add('msg-empate');

            cardUsuario.classList.remove('card-miss', 'card-win');
            cardCpu.classList.remove('card-win', 'card-miss');

            tocarSom(somEmpate);

            break;
    }
}

// Início da animação
cardUsuario.addEventListener('animationstart', () => {

    imgChoiceEnemy.src = './assets/icons/punho-direito.png';
    imgChoiceUser.src = './assets/icons/punho-esquerdo.png';

    limparEmoji();

    resultMsg.textContent = "Calculando resultado...";

    resultMsg.classList.remove('msg-miss', 'msg-win', 'msg-empate');

    cardUsuario.classList.remove('card-miss', 'card-win');
    cardCpu.classList.remove('card-win', 'card-miss');
});

// Fim da animação
cardUsuario.addEventListener('animationend', () => {

    if (!rodadaAtual) return;

    resultMsg.textContent = rodadaAtual.resultado;

    atualizarImagemJogada(
        rodadaAtual.inimigoJogada,
        rodadaAtual.usuarioJogada
    );

    aplicarEfeitoResultado(rodadaAtual.resultado);

    // Atualizar placar
    scoreUser.textContent = placar.jogador;
    scoreCpu.textContent = placar.inimigo;
});

// Jogo
cardsChoices.forEach(card => {

    card.addEventListener('click', (event) => {

        const botao = event.target.closest('button');
        if (!botao) return;

        // Reiniciar animações
        [cardCpu, cardUsuario].forEach(players => {
            players.classList.remove('batalha');
            resultMsg.classList.remove('result-animation');
        });

        [cardCpu, cardUsuario].forEach(players =>
            void players.offsetWidth
        );

        // Iniciar animações
        [cardCpu, cardUsuario].forEach(players => {
            players.classList.add('batalha');
            resultMsg.classList.add('result-animation');
        });

        const usuarioJogada = botao.id;
        const inimigoJogada = escolhaAleatoriaInimigo();

        const resultado = verificarVencedor(usuarioJogada, inimigoJogada);

        placar.registrar(resultado);

        // Salvar pontuação
        salvarPlacar();

        rodadaAtual = {
            usuarioJogada,
            inimigoJogada,
            resultado
        };
    });
});

// Resetar placar
resetarPlacar.addEventListener('click', () => {

    placar.resetar();

    rodadaAtual = null;

    pararSons();

    // Salvar placar zerado
    salvarPlacar();

    imgChoiceEnemy.src = './assets/icons/punho-direito.png';
    imgChoiceUser.src = './assets/icons/punho-esquerdo.png';

    limparEmoji();

    resultMsg.innerText = 'Faça sua jogada!';

    resultMsg.classList.remove('msg-miss', 'msg-win', 'msg-empate');

    cardUsuario.classList.remove('card-miss', 'card-win');
    cardCpu.classList.remove('card-win', 'card-miss');

    scoreUser.textContent = placar.jogador;
    scoreCpu.textContent = placar.inimigo;
});

// Ativar e desativar som
buttonSound.addEventListener('click', () => {

    somAtivo = !somAtivo;

    if (!somAtivo) {

        pararSons();

        buttonsoundOff.src = './assets/icons/sound-off.svg';

    } else {

        buttonsoundOff.src = './assets/icons/sound-on.svg';
    }
});