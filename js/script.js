
/* =================
   1) REGRAS DO JOGO
================= */
export const OPCOES = ["pedra", "papel", "tesoura"];

// REGRAS
export const REGRAS = {
    pedra: "tesoura",
    papel: "pedra",
    tesoura: "papel"
};

/** Retorna "jogador" | "inimigo" | "empate" */
export function verificarVencedor(jogadaJogador, jogadaInimigo) {
    if (jogadaJogador === jogadaInimigo) return "Empate na rodada";
    if (REGRAS[jogadaJogador] === jogadaInimigo) return "Você venceu a rodada";
    return "Cpu venceu a rodada";
}

/* ========================
   2) SISTEMA DE PONTUAÇÃO
======================== */
export const placar = {
    jogador: 0,
    inimigo: 0,
    empates: 0,

    registrar(resultado) {
        if (resultado === "Você venceu a rodada") this.jogador++;
        else if (resultado === "Cpu venceu a rodada") this.inimigo++;
        else this.empates++;
    },

    resetar() {
        this.jogador = 0;
        this.inimigo = 0;
        this.empates = 0;
    }
};

/* ===========================
   3) RANDOMIZAÇÃO DO INIMIGO
=========================== */
export function escolhaAleatoriaInimigo() {
    const indice = Math.floor(Math.random() * OPCOES.length);
    return OPCOES[indice];
}


