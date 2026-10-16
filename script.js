const corpoPagina = document.body;
const btnConfig = document.querySelector("#btn-config");
const painelConfig = document.querySelector("#painel-config");
const btnTema = document.querySelector("#btn-tema");
const btnAumentarFonte = document.querySelector("#btn-aumentar-fonte");
const btnDiminuirFonte = document.querySelector("#btn-diminuir-fonte");
const valorFonte = document.querySelector("#valor-fonte");
const infoAcesso = document.querySelector("#info-acesso");

const salvarLocal = function (chave, valor) {
  localStorage.setItem(chave, String(valor));
};

const obterLocal = (chave, padrao = null) => {
  const valor = localStorage.getItem(chave);
  return valor ?? padrao;
};

function atualizarTextoBotaoTema() {
  if (!btnTema) return;
  const escuroAtivo = corpoPagina.classList.contains("tema-escuro");
  btnTema.textContent = escuroAtivo ? "Modo Claro" : "Modo Escuro";
}

function atualizarRodape() {
  if (!infoAcesso) return;
  const visitas = obterLocal("totalVisitas", "1");
  const data = obterLocal("ultimoAcesso", "");
  const ultimoConsultado = obterLocal("ultimoVereadorConsultado", "Nenhum");
  infoAcesso.textContent = `Visitas registradas: ${visitas} | Último acesso: ${data} | Último parlamentar consultado: ${ultimoConsultado}`;
}

function inicializarPreferencias() {
  const temaSalvo = obterLocal("temaEscuro", "nao");
  const fonteSalva = Number(obterLocal("tamanhoFonte", "16"));
  const visitasAnteriores = Number(obterLocal("totalVisitas", "0"));
  const novoTotalVisitas = visitasAnteriores + 1;
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  const ultimoConsultado = obterLocal("ultimoVereadorConsultado", "Nenhum");

  salvarLocal("temaEscuro", temaSalvo);
  salvarLocal("tamanhoFonte", fonteSalva);
  salvarLocal("totalVisitas", novoTotalVisitas);
  salvarLocal("ultimoAcesso", dataAtual);
  salvarLocal("ultimoVereadorConsultado", ultimoConsultado);

  if (temaSalvo === "sim") {
    corpoPagina.classList.add("tema-escuro");
  }

  atualizarTextoBotaoTema();
  corpoPagina.style.fontSize = `${fonteSalva}px`;

  if (valorFonte) {
    valorFonte.textContent = `${fonteSalva}px`;
  }

  atualizarRodape();
}

function alterarTamanhoFonte(passo = 2) {
  let tamanhoAtual = Number(obterLocal("tamanhoFonte", "16"));
  tamanhoAtual += passo;

  if (tamanhoAtual < 12) tamanhoAtual = 12;
  if (tamanhoAtual > 22) tamanhoAtual = 22;

  corpoPagina.style.fontSize = `${tamanhoAtual}px`;
  salvarLocal("tamanhoFonte", tamanhoAtual);

  if (valorFonte) {
    valorFonte.textContent = `${tamanhoAtual}px`;
  }
}

if (btnConfig && painelConfig) {
  btnConfig.addEventListener("click", (event) => {
    event.stopPropagation();
    painelConfig.classList.toggle("oculto");
  });

  painelConfig.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    painelConfig.classList.add("oculto");
  });
}

if (btnTema) {
  btnTema.addEventListener("click", () => {
    corpoPagina.classList.toggle("tema-escuro");
    const ativo = corpoPagina.classList.contains("tema-escuro") ? "sim" : "nao";
    salvarLocal("temaEscuro", ativo);
    atualizarTextoBotaoTema();
  });
}

if (btnAumentarFonte) {
  btnAumentarFonte.addEventListener("click", () => alterarTamanhoFonte(2));
}

if (btnDiminuirFonte) {
  btnDiminuirFonte.addEventListener("click", () => alterarTamanhoFonte(-2));
}

document.addEventListener("DOMContentLoaded", inicializarPreferencias);

const dadosVereadores = [
  {
    nome: "Luan Cristian",
    partido: "SI",
    cargo: "Presidente da Câmara",
    mandato: "2025 - 2028 (2º Mandato)",
    comissao: "Comissão de Constituição, Justiça e Transformação Digital",
    gabinete: "Sala 101 - Anexo Legislativo | luan.cristian@camaraburitidocodo.leg.br",
    biografia: "Bacharel em Sistemas de Informação, atua na modernização administrativa do Poder Legislativo e na ampliação do acesso digital aos serviços públicos municipais, defendendo a transparência ativa das contas públicas.",
    projetos: [
      "PL nº 012/2026 - Programa de Digitalização Integral do Arquivo Público e Atas Legislativas.",
      "PL nº 027/2026 - Implantação de pontos de internet gratuita (Wi-Fi Livre) nas praças e mercados municipais.",
      "PL nº 041/2026 - Criação do Painel Cidadão para acompanhamento de obras em tempo real."
    ]
  },
  {
    nome: "Gustavo Antonio",
    partido: "TI",
    cargo: "Vice-presidente",
    mandato: "2025 - 2028 (1º Mandato)",
    comissao: "Comissão de Educação, Ciência, Tecnologia e Juventude",
    gabinete: "Sala 102 - Anexo Legislativo | gustavo.antonio@camaraburitidocodo.leg.br",
    biografia: "Focado no fortalecimento da educação básica e tecnológica no município, trabalha pela inclusão digital nas escolas da rede pública e pelo apoio ao transporte de estudantes universitários e técnicos.",
    projetos: [
      "PL nº 008/2026 - Modernização dos Laboratórios de Informática e Robótica nas escolas municipais.",
      "PL nº 019/2026 - Programa Bolsa e Transporte Universitário para estudantes de baixa renda.",
      "PL nº 035/2026 - Criação de cursos profissionalizantes gratuitos em parceria com instituições de ensino."
    ]
  },
  {
    nome: "Rian Leal",
    partido: "HTML",
    cargo: "1º Secretário",
    mandato: "2025 - 2028 (1º Mandato)",
    comissao: "Comissão de Direitos Humanos, Acessibilidade e Cultura",
    gabinete: "Sala 103 - Anexo Legislativo | rian.leal@camaraburitidocodo.leg.br",
    biografia: "Defensor da acessibilidade arquitetônica e digital nos órgãos públicos, coordena a secretaria legislativa garantindo que todas as publicações, editais e sessões sejam acessíveis a toda a população.",
    projetos: [
      "PL nº 014/2026 - Adequação de calçadas, rampas e prédios públicos às normas de acessibilidade.",
      "PL nº 023/2026 - Revitalização e ampliação do acervo da Biblioteca Pública Municipal.",
      "PL nº 039/2026 - Obrigatoriedade de intérprete de Libras nas sessões solenes e audiências públicas."
    ]
  },
  {
    nome: "Nilson Bruno",
    partido: "CSS",
    cargo: "2º Secretário",
    mandato: "2025 - 2028 (1º Mandato)",
    comissao: "Comissão de Urbanismo, Meio Ambiente e Infraestrutura",
    gabinete: "Sala 104 - Anexo Legislativo | nilson.bruno@camaraburitidocodo.leg.br",
    biografia: "Atua diretamente na fiscalização de obras de infraestrutura urbana, iluminação pública e preservação de espaços de convivência, buscando bairros mais seguros, arborizados e bem planejados.",
    projetos: [
      "PL nº 005/2026 - Plano de Revitalização Paisagística e Visual dos parques e praças dos bairros.",
      "PL nº 021/2026 - Substituição gradual da iluminação pública convencional por lâmpadas de LED.",
      "PL nº 044/2026 - Programa de incentivo à arborização urbana e coleta seletiva solidária."
    ]
  }
];

const campoBuscaVereador = document.querySelector("#busca-vereador");
const seletorPartido = document.querySelector("#filtro-partido");
const containerVereadores = document.querySelector("#container-vereadores");
const painelVereador = document.querySelector("#painel-vereador");
let vereadorAbertoAtual = null;

function buscarVereadorPorNome(nomeProcurado) {
  let encontrado = null;
  for (const vereador of dadosVereadores) {
    if (vereador.nome === nomeProcurado) {
      encontrado = vereador;
      break;
    }
  }
  return encontrado;
}

function filtrarVereadores() {
  if (!containerVereadores) return;
  const termo = campoBuscaVereador ? campoBuscaVereador.value.toLowerCase().trim() : "";
  const partidoEscolhido = seletorPartido ? seletorPartido.value : "todos";
  const cartoes = containerVereadores.querySelectorAll(".card-vereador");

  for (const cartao of cartoes) {
    const nome = cartao.getAttribute("data-nome").toLowerCase();
    const partido = cartao.getAttribute("data-partido");
    const correspondeNome = nome.indexOf(termo) !== -1;
    const correspondePartido = partidoEscolhido === "todos" || partido === partidoEscolhido;

    if (correspondeNome && correspondePartido) {
      cartao.classList.remove("oculto");
    } else {
      cartao.classList.add("oculto");
    }
  }
}

function atualizarEstadoCartoes(nomeAtivo) {
  if (!containerVereadores) return;
  const cartoes = containerVereadores.querySelectorAll(".card-vereador");
  for (const cartao of cartoes) {
    const botao = cartao.querySelector(".btn-detalhes");
    if (cartao.getAttribute("data-nome") === nomeAtivo) {
      cartao.classList.add("card-ativo");
      if (botao) botao.textContent = "Fechar detalhes";
    } else {
      cartao.classList.remove("card-ativo");
      if (botao) botao.textContent = "Ver detalhes";
    }
  }
}

function renderizarDetalhesVereador(dados) {
  if (!painelVereador) return;
  painelVereador.textContent = "";

  const titulo = document.createElement("h3");
  titulo.textContent = `${dados.nome} — ${dados.cargo} (Partido ${dados.partido})`;

  const textoBio = document.createElement("p");
  textoBio.textContent = dados.biografia;

  const infoMandato = document.createElement("p");
  infoMandato.textContent = `Mandato: ${dados.mandato} | ${dados.comissao}`;

  const infoGabinete = document.createElement("p");
  infoGabinete.textContent = `Atendimento: ${dados.gabinete}`;

  const subtituloProjetos = document.createElement("h4");
  subtituloProjetos.textContent = "Principais Projetos de Lei e Iniciativas:";

  const listaProjetos = document.createElement("ul");
  for (const projeto of dados.projetos) {
    const item = document.createElement("li");
    item.textContent = projeto;
    listaProjetos.appendChild(item);
  }

  painelVereador.appendChild(titulo);
  painelVereador.appendChild(textoBio);
  painelVereador.appendChild(infoMandato);
  painelVereador.appendChild(infoGabinete);
  painelVereador.appendChild(subtituloProjetos);
  painelVereador.appendChild(listaProjetos);
  painelVereador.classList.remove("oculto");
}

if (campoBuscaVereador) {
  campoBuscaVereador.addEventListener("input", filtrarVereadores);
}

if (seletorPartido) {
  seletorPartido.addEventListener("change", filtrarVereadores);
}

if (containerVereadores) {
  containerVereadores.addEventListener("click", (event) => {
    const botaoDetalhes = event.target.closest(".btn-detalhes");
    if (!botaoDetalhes) return;

    const cartao = botaoDetalhes.closest(".card-vereador");
    if (!cartao) return;

    const nomeEscolhido = cartao.getAttribute("data-nome");

    if (vereadorAbertoAtual === nomeEscolhido) {
      vereadorAbertoAtual = null;
      painelVereador.classList.add("oculto");
      atualizarEstadoCartoes(null);
      return;
    }

    const dados = buscarVereadorPorNome(nomeEscolhido);
    if (!dados) return;

    vereadorAbertoAtual = nomeEscolhido;
    salvarLocal("ultimoVereadorConsultado", nomeEscolhido);
    atualizarRodape();
    atualizarEstadoCartoes(nomeEscolhido);
    renderizarDetalhesVereador(dados);
  });
}

const campoBuscaNoticia = document.querySelector("#busca-noticia");
const listaNoticias = document.querySelector(".lista-noticias");
const contadorNoticias = document.querySelector("#contador-noticias");
const seletorSessao = document.querySelector("#filtro-sessao");
const linhasSessoes = document.querySelectorAll("#sessoes tbody tr");
const menuSidebar = document.querySelector(".sidebar");
const secoesPagina = document.querySelectorAll("main section");

const salvarSessao = function (chave, valor) {
  sessionStorage.setItem(chave, String(valor));
};

const obterSessao = (chave, padrao = "") => {
  const valor = sessionStorage.getItem(chave);
  return valor ?? padrao;
};

function mostrarSecao(idSecao) {
  salvarSessao("secaoAtiva", idSecao);

  for (const secao of secoesPagina) {
    if (idSecao === "todas" || secao.id === idSecao) {
      secao.classList.remove("oculto");
    } else {
      secao.classList.add("oculto");
    }
  }

  if (menuSidebar) {
    const links = menuSidebar.querySelectorAll("a");
    for (const link of links) {
      if (link.getAttribute("href") === `#${idSecao}`) {
        link.classList.add("link-ativo");
      } else {
        link.classList.remove("link-ativo");
      }
    }
  }
}

function inicializarSessao() {
  const secaoSalva = obterSessao("secaoAtiva", "todas");
  salvarSessao("secaoAtiva", secaoSalva);
  salvarSessao("termoBuscaNoticia", obterSessao("termoBuscaNoticia", ""));
  salvarSessao("filtroTipoSessao", obterSessao("filtroTipoSessao", "todas"));
  salvarSessao("noticiasMarcadas", obterSessao("noticiasMarcadas", "0"));
  salvarSessao("cliquesSessao", obterSessao("cliquesSessao", "0"));

  mostrarSecao(secaoSalva);

  if (campoBuscaNoticia) {
    campoBuscaNoticia.value = obterSessao("termoBuscaNoticia", "");
    filtrarNoticias();
  }

  if (seletorSessao) {
    seletorSessao.value = obterSessao("filtroTipoSessao", "todas");
    filtrarTabelaSessoes();
  }
}

function filtrarNoticias() {
  if (!listaNoticias) return;
  const termo = campoBuscaNoticia ? campoBuscaNoticia.value.toLowerCase().trim() : "";
  salvarSessao("termoBuscaNoticia", termo);

  const itens = listaNoticias.querySelectorAll("li");
  let visiveis = 0;

  for (const item of itens) {
    const texto = item.textContent.toLowerCase();
    if (texto.indexOf(termo) === -1) {
      item.classList.add("oculto");
      continue;
    }
    item.classList.remove("oculto");
    visiveis++;
  }

  if (contadorNoticias) {
    contadorNoticias.textContent = `Exibindo ${visiveis} de ${itens.length} notícias publicadas.`;
  }
}

function filtrarTabelaSessoes() {
  const tipoSelecionado = seletorSessao ? seletorSessao.value : "todas";
  salvarSessao("filtroTipoSessao", tipoSelecionado);

  for (const linha of linhasSessoes) {
    const celulas = linha.querySelectorAll("td");
    if (celulas.length < 2) continue;
    const tipoLinha = celulas[1].textContent.trim();

    if (tipoSelecionado === "todas" || tipoLinha === tipoSelecionado) {
      linha.classList.remove("oculto");
    } else {
      linha.classList.add("oculto");
    }
  }
}

if (campoBuscaNoticia) {
  campoBuscaNoticia.addEventListener("keyup", filtrarNoticias);
}

if (seletorSessao) {
  seletorSessao.addEventListener("change", filtrarTabelaSessoes);
}

if (listaNoticias) {
  listaNoticias.addEventListener("click", (event) => {
    const itemNoticia = event.target.closest("li");
    if (!itemNoticia) return;

    itemNoticia.classList.toggle("noticia-lida");
    const lidas = listaNoticias.querySelectorAll(".noticia-lida").length;
    salvarSessao("noticiasMarcadas", lidas);
  });
}

if (menuSidebar) {
  menuSidebar.addEventListener("click", (event) => {
    const linkClicado = event.target.closest("a");
    if (!linkClicado) return;

    event.preventDefault();
    const idDestino = linkClicado.getAttribute("href").replace("#", "");
    mostrarSecao(idDestino);

    const cliques = Number(obterSessao("cliquesSessao", "0")) + 1;
    salvarSessao("cliquesSessao", cliques);
  });
}

document.addEventListener("DOMContentLoaded", inicializarSessao);

const formOuvidoria = document.querySelector("#form-ouvidoria");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoAssunto = document.querySelector("#assunto");
const campoMensagem = document.querySelector("#mensagem");
const feedbackOuvidoria = document.querySelector("#feedback-ouvidoria");
const painelProtocolos = document.querySelector("#painel-protocolos");
const listaProtocolos = document.querySelector("#lista-protocolos");

function definirCookie(nome, valor, dias = 7) {
  const segundos = dias * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(nome)}=${encodeURIComponent(valor)}; max-age=${segundos}; path=/`;
}

function lerCookie(nome, padrao = "") {
  const nomeCodificado = `${encodeURIComponent(nome)}=`;
  const partes = document.cookie.split(";");

  for (const parte of partes) {
    const item = parte.trim();
    if (item.indexOf(nomeCodificado) === 0) {
      return decodeURIComponent(item.substring(nomeCodificado.length));
    }
  }
  return padrao;
}

function formatarConfirmacaoEnvio(saudacao, ...partes) {
  let texto = saudacao;
  for (let i = 1; i < arguments.length; i++) {
    texto += ` — ${arguments[i]}`;
  }
  return texto;
}

function obterRotuloAssunto(valorAssunto) {
  let rotulo = "Outro";
  switch (valorAssunto) {
    case "duvida":
      rotulo = "Dúvida";
      break;
    case "sugestao":
      rotulo = "Sugestão";
      break;
    case "reclamacao":
      rotulo = "Reclamação";
      break;
    case "elogio":
      rotulo = "Elogio";
      break;
    default:
      rotulo = "Outro";
      break;
  }
  return rotulo;
}

function inicializarCookiesOuvidoria() {
  const nomeSalvo = lerCookie("cidadaoNome", "");
  const emailSalvo = lerCookie("cidadaoEmail", "");
  const assuntoSalvo = lerCookie("ultimoAssuntoOuvidoria", "");
  const dataSalva = lerCookie("dataUltimoEnvio", "Nenhum");
  const totalEnviadas = lerCookie("totalManifestacoesEnviadas", "0");

  definirCookie("cidadaoNome", nomeSalvo);
  definirCookie("cidadaoEmail", emailSalvo);
  definirCookie("ultimoAssuntoOuvidoria", assuntoSalvo);
  definirCookie("dataUltimoEnvio", dataSalva);
  definirCookie("totalManifestacoesEnviadas", totalEnviadas);

  if (campoNome && nomeSalvo) {
    campoNome.value = nomeSalvo;
  }

  if (campoEmail && emailSalvo) {
    campoEmail.value = emailSalvo;
  }

  if (campoAssunto && assuntoSalvo) {
    campoAssunto.value = assuntoSalvo;
  }
}

function adicionarMensagemNaLista(tituloCard, camposMensagem) {
  if (!listaProtocolos || !painelProtocolos) return;

  const item = document.createElement("li");
  item.classList.add("item-protocolo");

  const blocoTexto = document.createElement("div");
  blocoTexto.classList.add("conteudo-mensagem");

  const titulo = document.createElement("h4");
  titulo.textContent = tituloCard;
  blocoTexto.appendChild(titulo);

  for (const chave in camposMensagem) {
    const paragrafo = document.createElement("p");
    const rotulo = document.createElement("strong");
    rotulo.textContent = `${chave}: `;
    const valor = document.createTextNode(camposMensagem[chave]);
    paragrafo.appendChild(rotulo);
    paragrafo.appendChild(valor);
    blocoTexto.appendChild(paragrafo);
  }

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.classList.add("btn-remover-protocolo");
  botaoRemover.textContent = "Excluir mensagem";

  item.appendChild(blocoTexto);
  item.appendChild(botaoRemover);
  listaProtocolos.appendChild(item);
  painelProtocolos.classList.remove("oculto");
}

if (formOuvidoria) {
  formOuvidoria.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = campoNome ? campoNome.value.trim() : "";
    const email = campoEmail ? campoEmail.value.trim() : "";
    const assunto = campoAssunto ? campoAssunto.value : "";
    const mensagem = campoMensagem ? campoMensagem.value.trim() : "";

    if (nome.length < 3 || mensagem.length < 5 || !assunto) {
      if (feedbackOuvidoria) {
        feedbackOuvidoria.textContent = "Por favor, preencha todos os campos corretamente antes de enviar.";
      }
      return;
    }

    const dataEnvio = new Date().toLocaleDateString("pt-BR");
    const rotuloAssunto = obterRotuloAssunto(assunto);
    const totalAnterior = Number(lerCookie("totalManifestacoesEnviadas", "0"));
    const novoTotal = totalAnterior + 1;

    definirCookie("cidadaoNome", nome);
    definirCookie("cidadaoEmail", email);
    definirCookie("ultimoAssuntoOuvidoria", assunto);
    definirCookie("dataUltimoEnvio", dataEnvio);
    definirCookie("totalManifestacoesEnviadas", novoTotal);

    const tituloCard = `${rotuloAssunto} — Enviada em ${dataEnvio}`;
    const camposMensagem = {
      Remetente: `${nome} (${email})`,
      Mensagem: mensagem
    };

    adicionarMensagemNaLista(tituloCard, camposMensagem);

    if (feedbackOuvidoria) {
      feedbackOuvidoria.textContent = formatarConfirmacaoEnvio(
        "Mensagem enviada com sucesso!",
        `Assunto: ${rotuloAssunto}`,
        `Registrada por ${nome}`
      );
    }

    if (campoMensagem) {
      campoMensagem.value = "";
    }
  });
}

if (listaProtocolos) {
  listaProtocolos.addEventListener("click", (event) => {
    if (event.target.matches(".btn-remover-protocolo")) {
      const itemParaRemover = event.target.closest(".item-protocolo");
      if (itemParaRemover) {
        itemParaRemover.remove();
      }
      if (listaProtocolos.querySelectorAll(".item-protocolo").length === 0 && painelProtocolos) {
        painelProtocolos.classList.add("oculto");
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarCookiesOuvidoria);