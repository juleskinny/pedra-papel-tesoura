::variant="standard" title="Código JavaScript corrigido" id="83152"}
import { verificarVencedor, escolhaAleatoriaInimigo, placar } from "./script.js";

let somAtivo = true;

// Caminho dos arquivos
const asset = (caminho) => new URL(`assets/${caminho}`, document.baseURI).href;

// Áudios
const somDerrota = new Audio(asset('musica e efeitos de som/lose-audio.m4a'));
const somVitoria = new Audio(asset('musica e efeitos de som/win-audio.mp3'));
const somEmpate = new Audio(asset('musica e efeitos de som/empate-audio.mp3'));

function pararSons() {
    [somDerrota, somEmpate, somVitoria].forEach(som => {
        som.pause();
        som.currentTime = 0;
    });
}

function tocarSom(som) {
    if (somAtivo) {
        pararSons();

        som.play().catch(erro => {
            console.warn('Não foi possível reproduzir o áudio:', erro);
        });
    }
}

// Elementos
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

// Estado da rodada
let rodadaAtual = null;

// LocalStorage
const placarSalvo = JSON.parse(localStorage.getItem('placar'));

if (placarSalvo) {
    placar.jogador = placarSalvo.jogador;
    placar.inimigo = placarSalvo.inimigo;
}

scoreUser.textContent = placar.jogador;
scoreCpu.textContent = placar.inimigo;

// Atualizar imagens
function atualizarImagemJogada(cpuChoice, userChoice) {

    const imagens = {
        tesoura: asset('icons/scissors_2702-fe0f.png'),
        pedra: asset('icons/rock_1faa8.png'),
        papel: asset('icons/paper_1f4c4.png')
    };

    imgChoiceEnemy.src = imagens[cpuChoice];
    imgChoiceUser.src = imagens[userChoice];
}

// Aplicar efeitos do resultado
function aplicarEfeitoResultado(result) {

    switch (result) {

        case "Você venceu a rodada":

            emojiResultado.src = asset('icons/emoji-win.png');

            resultMsg.classList.remove('msg-empate', 'msg-miss');
            resultMsg.classList.add('msg-win');

            cardUsuario.classList.remove('card-miss');
            cardUsuario.classList.add('card-win');

            cardCpu.classList.remove('card-win');
            cardCpu.classList.add('card-miss');

            tocarSom(somVitoria);
            break;

        case "Cpu venceu a rodada":

            emojiResultado.src = asset('icons/cpu-win-emoji.png');

            resultMsg.classList.remove('msg-empate', 'msg-win');
            resultMsg.classList.add('msg-miss');

            cardUsuario.classList.remove('card-win');
            cardUsuario.classList.add('card-miss');

            cardCpu.classList.remove('card-miss');
            cardCpu.classList.add('card-win');

            tocarSom(somDerrota);
            break;

        default:

            emojiResultado.src = asset('icons/emjoi-empate.png');

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

    imgChoiceEnemy.src = asset('icons/punho-direito.png');
    imgChoiceUser.src = asset('icons/punho-esquerdo.png');

    emojiResultado.src = '';

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

        const resultado = verificarVencedor(
            usuarioJogada,
            inimigoJogada
        );

        placar.registrar(resultado);

        // Salvar pontuação
        localStorage.setItem('placar', JSON.stringify({
            jogador: placar.jogador,
            inimigo: placar.inimigo
        }));

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

    localStorage.setItem('placar', JSON.stringify({
        jogador: placar.jogador,
        inimigo: placar.inimigo
    }));

    imgChoiceEnemy.src = asset('icons/punho-direito.png');
    imgChoiceUser.src = asset('icons/punho-esquerdo.png');

    emojiResultado.src = '';

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

        buttonsoundOff.src = asset('icons/sound-off.svg');

    } else {

        buttonsoundOff.src = asset('icons/sound-on.svg');
    }
});