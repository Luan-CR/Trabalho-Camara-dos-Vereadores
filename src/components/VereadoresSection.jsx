import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buscarVereadores } from '../services/api.js';
import StatusCarregamento from './StatusCarregamento.jsx';

export default function VereadoresSection({ onVereadorConsultado }) {
  const [vereadores, setVereadores] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [partidoFiltro, setPartidoFiltro] = useState('todos');
  const [vereadorAberto, setVereadorAberto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);

    buscarVereadores(controller.signal)
      .then((lista) => {
        setVereadores(lista);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível carregar a bancada de vereadores.');
        }
      })
      .finally(() => {
        setCarregando(false);
      });

    return () => controller.abort();
  }, []);

  const limparFiltros = () => {
    setTermoBusca('');
    setPartidoFiltro('todos');
  };

  const alternarDetalhes = (vereador) => {
    if (vereadorAberto && vereadorAberto.id === vereador.id) {
      setVereadorAberto(null);
      return;
    }

    setVereadorAberto(vereador);

    if (onVereadorConsultado) {
      onVereadorConsultado(vereador.nome);
    }
  };

  const termoLimpo = termoBusca.toLowerCase().trim();

  const vereadoresFiltrados = vereadores.filter((vereador) => {
    const correspondeNome =
      vereador.nome.toLowerCase().indexOf(termoLimpo) !== -1;

    const correspondePartido =
      partidoFiltro === 'todos' || vereador.partido === partidoFiltro;

    return correspondeNome && correspondePartido;
  });

  return (
    <section id="vereadores">
      <h2>Vereadores</h2>

      <p className="descricao-secao">
        Conheça os parlamentares que compõem a atual legislatura (2025–2028) da Câmara
        Municipal de Buriti do Codô. Utilize a busca abaixo para filtrar por nome ou
        partido e clique em <strong>Ver detalhes</strong> para consultar a biografia,
        comissões, gabinete e projetos de lei de cada vereador. Use{' '}
        <strong>Ver página</strong> para abrir o perfil completo do parlamentar.
      </p>

      <div className="barra-filtros">
        <input
          type="text"
          id="busca-vereador"
          placeholder="Buscar vereador pelo nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />

        <select
          id="filtro-partido"
          value={partidoFiltro}
          onChange={(e) => setPartidoFiltro(e.target.value)}
        >
          <option value="todos">Todos os partidos</option>
          <option value="SI">Partido SI</option>
          <option value="TI">Partido TI</option>
          <option value="HTML">Partido HTML</option>
          <option value="CSS">Partido CSS</option>
        </select>

        <button
          type="button"
          id="btn-limpar-vereadores"
          className="btn-limpar"
          onClick={limparFiltros}
        >
          Limpar filtros
        </button>
      </div>

      <StatusCarregamento
        carregando={carregando}
        erro={erro}
        mensagemCarregando="Carregando parlamentares..."
      />

      {!carregando && !erro && (
        <>
          <p id="contador-vereadores" className="contador-resultados">
            {vereadoresFiltrados.length === 0
              ? 'Nenhum vereador encontrado para os filtros selecionados.'
              : `Exibindo ${vereadoresFiltrados.length} de ${vereadores.length} vereadores.`}
          </p>

          <div className="lista-vereadores" id="container-vereadores">
            {vereadoresFiltrados.map((vereador) => {
              const ativo = vereadorAberto && vereadorAberto.id === vereador.id;

              return (
                <article
                  key={vereador.id}
                  className={`card-vereador ${ativo ? 'card-ativo' : ''}`}
                  data-nome={vereador.nome}
                  data-partido={vereador.partido}
                >
                  <img
                    src={vereador.foto}
                    alt={`Foto do vereador ${vereador.nome}`}
                    className="foto-perfil"
                  />

                  <h3>{vereador.nome}</h3>

                  <p>
                    <strong>Partido:</strong> {vereador.partido}
                  </p>

                  <p className="cargo-vereador">{vereador.cargo}</p>

                  <button
                    type="button"
                    className="btn-card btn-detalhes"
                    onClick={() => alternarDetalhes(vereador)}
                  >
                    {ativo ? 'Fechar detalhes' : 'Ver detalhes'}
                  </button>

                  <Link
                    className="btn-link btn-pagina"
                    to={`/vereadores/${vereador.id}`}
                  >
                    Ver página
                  </Link>
                </article>
              );
            })}
          </div>

          {vereadorAberto && (
            <div id="painel-vereador" className="painel-detalhes">
              <h3>
                {vereadorAberto.nome} — {vereadorAberto.cargo} (Partido{' '}
                {vereadorAberto.partido})
              </h3>

              <p>{vereadorAberto.biografia}</p>

              <p>
                Mandato: {vereadorAberto.mandato} | {vereadorAberto.comissao}
              </p>

              <p>Atendimento: {vereadorAberto.gabinete}</p>

              <h4>Principais Projetos de Lei e Iniciativas:</h4>

              <ul>
                {vereadorAberto.projetos.map((projeto, idx) => (
                  <li key={idx}>{projeto}</li>
                ))}
              </ul>

              <Link
                className="btn-link"
                to={`/vereadores/${vereadorAberto.id}`}
              >
                Ver página completa de {vereadorAberto.nome}
              </Link>
            </div>
          )}

          <div className="info-contato bloco-espacado">
            <h3>O Papel da Mesa Diretora</h3>

            <p>
              A Mesa Diretora é responsável pela direção dos trabalhos legislativos e
              pelos serviços administrativos da Câmara. Composta pelo Presidente,
              Vice-Presidente, 1º Secretário e 2º Secretário, ela coordena a pauta das
              sessões plenárias, promulga resoluções e assegura o regular funcionamento da
              Casa.
            </p>
          </div>
        </>
      )}
    </section>
  );
}
