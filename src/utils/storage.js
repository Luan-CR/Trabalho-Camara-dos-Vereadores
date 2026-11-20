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