
import { useState, useEffect } from 'react';
import { buscarDadosCamara } from '../services/api.js';
import {
  inicializarCookiesOuvidoria,
  registrarEnvioCookiesOuvidoria,
  obterProtocolosSessao,
  salvarProtocolosSessao,
} from '../utils/storage.js';

function formatarConfirmacaoEnvio(saudacao, ...partes) {
  let texto = saudacao;

  for (const parte of partes) {
    texto += ` — ${parte}`;
  }

  return texto;
}

function obterRotuloAssunto(valorAssunto) {
  let rotulo = 'Outro';

  switch (valorAssunto) {
    case 'duvida':
      rotulo = 'Dúvida';
      break;
    case 'sugestao':
      rotulo = 'Sugestão';
      break;
    case 'reclamacao':
      rotulo = 'Reclamação';
      break;
    case 'elogio':
      rotulo = 'Elogio';
      break;
    default:
      rotulo = 'Outro';
      break;
  }

  return rotulo;
}

export default function OuvidoriaSection() {
  const [etapas, setEtapas] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [feedback, setFeedback] = useState('');
  const [protocolos, setProtocolos] = useState(() => obterProtocolosSessao());

  useEffect(() => {
    const cookiesIniciais = inicializarCookiesOuvidoria();

    if (cookiesIniciais.cidadaoNome) setNome(cookiesIniciais.cidadaoNome);
    if (cookiesIniciais.cidadaoEmail) setEmail(cookiesIniciais.cidadaoEmail);

    if (cookiesIniciais.ultimoAssuntoOuvidoria) {
      setAssunto(cookiesIniciais.ultimoAssuntoOuvidoria);
    }

    const controller = new AbortController();

    buscarDadosCamara(controller.signal)
      .then((dados) => {
        if (dados.ouvidoria && dados.ouvidoria.etapas) {
          setEtapas(dados.ouvidoria.etapas);
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const limparCampos = () => {
    setNome('');
    setEmail('');
    setAssunto('');
    setMensagem('');
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const mensagemLimpa = mensagem.trim();

    if (nomeLimpo.length < 3 || mensagemLimpa.length < 5 || !assunto) {
      setFeedback(
        'Por favor, preencha todos os campos corretamente antes de enviar.'
      );
      return;
    }

    const dataEnvio = new Date().toLocaleDateString('pt-BR');
    const rotuloAssunto = obterRotuloAssunto(assunto);

    registrarEnvioCookiesOuvidoria({
      nome: nomeLimpo,
      email: emailLimpo,
      assunto,
      dataEnvio,
    });

    const tituloCard = `${rotuloAssunto} — Enviada em ${dataEnvio}`;

    const camposMensagem = {
      Remetente: `${nomeLimpo} (${emailLimpo})`,
      Mensagem: mensagemLimpa,
    };

    const linhasFormatadas = [];

    for (const chave in camposMensagem) {
      linhasFormatadas.push({ rotulo: chave, valor: camposMensagem[chave] });
    }

    const novoProtocolo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tituloCard,
      linhas: linhasFormatadas,
    };

    const novaLista = [...protocolos, novoProtocolo];

    setProtocolos(novaLista);
    salvarProtocolosSessao(novaLista);

    setFeedback(
      formatarConfirmacaoEnvio(
        'Mensagem enviada com sucesso!',
        `Assunto: ${rotuloAssunto}`,
        `Registrada por ${nomeLimpo}`
      )
    );

    setMensagem('');
  };

  const removerProtocolo = (idParaRemover) => {
    const atualizados = protocolos.filter((item) => item.id !== idParaRemover);

    setProtocolos(atualizados);
    salvarProtocolosSessao(atualizados);
  };

  return (
    <section id="ouvidoria">
      <h2>Fale Conosco</h2>

      <p className="descricao-secao">
        A Ouvidoria Parlamentar é o canal direto entre o cidadão e a Câmara Municipal.
        Utilize o formulário abaixo para registrar dúvidas, sugestões de projetos,
        reclamações ou elogios.
      </p>

      <div className="info-contato">
        <h3>Como funciona o atendimento da Ouvidoria?</h3>

        {etapas.length > 0 ? (
          etapas.map((etapa, idx) => (
            <p key={idx}>
              <strong>{etapa.titulo}:</strong> {etapa.descricao}
            </p>
          ))
        ) : (
          <>
            <p>
              <strong>1. Registro da Manifestação:</strong> Preencha seus dados
              corretamente, selecione o assunto e descreva sua mensagem com clareza.
            </p>

            <p>
              <strong>2. Análise pelo Setor Responsável:</strong> Ao enviar o formulário,
              sua mensagem é encaminhada diretamente à secretaria ou comissão competente.
            </p>

            <p>
              <strong>3. Prazo de Resposta:</strong> Em conformidade com a Lei de Acesso à
              Informação, o prazo máximo de resposta pelo e-mail informado é de até 15
              dias úteis.
            </p>
          </>
        )}
      </div>

      <form id="form-ouvidoria" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Ouvidoria da Câmara</legend>

          <div className="campo">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="assunto">Assunto:</label>
            <select
              id="assunto"
              name="assunto"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              required
            >
              <option value="">Selecione um assunto</option>
              <option value="duvida">Dúvida</option>
              <option value="sugestao">Sugestão</option>
              <option value="reclamacao">Reclamação</option>
              <option value="elogio">Elogio</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="mensagem">Mensagem:</label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows="5"
              maxLength="300"
              placeholder="Escreva sua mensagem aqui..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
            />

            <p id="contador-caracteres" className="contador-caracteres">
              Caracteres digitados: {mensagem.length} / 300
            </p>
          </div>

          <div className="botoes-formulario">
            <button type="submit">Enviar Mensagem</button>

            <button
              type="button"
              id="btn-limpar-ouvidoria"
              className="btn-secundario"
              onClick={limparCampos}
            >
              Limpar campos
            </button>
          </div>

          <p id="feedback-ouvidoria" className="mensagem-feedback">
            {feedback}
          </p>
        </fieldset>
      </form>

      <div
        id="painel-protocolos"
        className={`painel-detalhes ${protocolos.length === 0 ? 'oculto' : ''}`}
      >
        <h3>Mensagens Enviadas</h3>

        <p id="contador-protocolos" className="contador-resultados">
          Total de mensagens registradas nesta sessão: {protocolos.length}
        </p>

        <ul id="lista-protocolos" className="lista-protocolos">
          {protocolos.map((item) => (
            <li key={item.id} className="item-protocolo">
              <div className="conteudo-mensagem">
                <h4>{item.tituloCard}</h4>

                {item.linhas.map((linha, idx) => (
                  <p key={idx}>
                    <strong>{linha.rotulo}: </strong>
                    {linha.valor}
                  </p>
                ))}
              </div>

              <button
                type="button"
                className="btn-remover-protocolo"
                onClick={() => removerProtocolo(item.id)}
              >
                Excluir mensagem
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
