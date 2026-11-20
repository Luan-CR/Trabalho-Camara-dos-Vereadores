export const salvarLocal = function (chave, valor) {
    localStorage.setItem(chave, String(valor));
};

export const obterLocal = (chave, padrao = null) => {
    const valor = localStorage.getItem(chave);
    return valor ?? padrao;
};

export function inicializarPreferenciasLocais() {
    const temaSalvo = obterLocal('temaEscuro', 'nao');
    const fonteSalva = Number(obterLocal('tamanhoFonte', '16'));
    const visitasAnteriores = Number(obterLocal('totalVisitas', '0'));
    const novoTotalVisitas = visitasAnteriores + 1;
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const ultimoConsultado = obterLocal('ultimoVereadorConsultado', 'Nenhum');

    salvarLocal('temaEscuro', temaSalvo);
    salvarLocal('tamanhoFonte', fonteSalva);
    salvarLocal('totalVisitas', novoTotalVisitas);
    salvarLocal('ultimoAcesso', dataAtual);
    salvarLocal('ultimoVereadorConsultado', ultimoConsultado);

    return {
        temaEscuro: temaSalvo === 'sim',
        tamanhoFonte: fonteSalva,
        totalVisitas: novoTotalVisitas,
        ultimoAcesso: dataAtual,
        ultimoVereadorConsultado: ultimoConsultado,
    };
}

export const salvarSessao = function (chave, valor) {
    sessionStorage.setItem(chave, String(valor));
};

export const obterSessao = (chave, padrao = '') => {
    const valor = sessionStorage.getItem(chave);
    return valor ?? padrao;
};

export function inicializarDadosSessao() {
    const secaoAtiva = obterSessao('secaoAtiva', 'todas');
    const termoBuscaNoticia = obterSessao('termoBuscaNoticia', '');
    const filtroTipoSessao = obterSessao('filtroTipoSessao', 'todas');
    const noticiasMarcadas = obterSessao('noticiasMarcadas', '0');
    const cliquesSessao = obterSessao('cliquesSessao', '0');

    salvarSessao('secaoAtiva', secaoAtiva);
    salvarSessao('termoBuscaNoticia', termoBuscaNoticia);
    salvarSessao('filtroTipoSessao', filtroTipoSessao);
    salvarSessao('noticiasMarcadas', noticiasMarcadas);
    salvarSessao('cliquesSessao', cliquesSessao);

    return {
        secaoAtiva,
        termoBuscaNoticia,
        filtroTipoSessao,
        noticiasMarcadas: Number(noticiasMarcadas),
        cliquesSessao: Number(cliquesSessao),
    };
}

export function registrarCliqueSessao() {
    const cliques = Number(obterSessao('cliquesSessao', '0')) + 1;
    salvarSessao('cliquesSessao', cliques);
    return cliques;
}

export function incrementarNoticiasMarcadas() {
    const totalLidas = Number(obterSessao('noticiasMarcadas', '0')) + 1;
    salvarSessao('noticiasMarcadas', totalLidas);
    return totalLidas;
}