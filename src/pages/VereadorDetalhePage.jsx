import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarVereadorPorId } from '../services/api.js';
export default function VereadorDetalhePage({ onVereadorConsultado }) {
  const { id } = useParams();
  const [vereador, setVereador] = useState(null);
  const [outrosVereadores, setOutrosVereadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro('');
    buscarVereadorPorId(id, controller.signal)
      .then(({ vereador: encontrado, todosVereadores }) => {
        if (!encontrado) {
          document.title =
            'Vereador não encontrado - Câmara Municipal de Buriti do Codô';
          setVereador(null);
          setOutrosVereadores([]);
          return;
        }
        document.title = `${encontrado.nome} - Vereador - Câmara Municipal de Buriti do Codô`;
        setVereador(encontrado);
        if (onVereadorConsultado) {
          onVereadorConsultado(encontrado.nome);
        }
        const demais = [];
        for (const outro of todosVereadores) {
          if (outro.id === encontrado.id) continue;
          demais.push(outro);
        }
        setOutrosVereadores(demais);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Falha ao buscar o perfil do vereador via Fetch API.');
        }
      })
      .finally(() => {
        setCarregando(false);
      });
    return () => controller.abort();
  }, [id, onVereadorConsultado]);
  if (carregando) {
    return (
      <div id="conteudo-vereador">
        <p>Carregando perfil parlamentar...</p>
      </div>
    );
  }
  if (erro) {
    return (
      <div id="conteudo-vereador">
        <Link to="/vereadores" className="link-voltar">
          ← Voltar para os vereadores
        </Link>
        <h2>Erro ao carregar parlamentar</h2>
        <p className="mensagem-feedback">{erro}</p>
      </div>
    );
  }
  if (!vereador) {
    return (
      <div id="conteudo-vereador">
        <Link to="/vereadores" className="link-voltar">
          ← Voltar para os vereadores
        </Link>
        <h2>Vereador não encontrado</h2>
        <p>
          O parlamentar solicitado não existe ou não faz parte da legislatura atual.
        </p>
      </div>
    );
  }
  const partesGabinete = vereador.gabinete.split(' | ');
  return (
    <div id="conteudo-vereador">
      <section className="pagina-vereador">
        <Link to="/vereadores" className="link-voltar">
          ← Voltar para os vereadores
        </Link>
        <h2>{vereador.nome}</h2>
        <div className="perfil-vereador">
          <img
            src={vereador.foto}
            alt={`Foto do vereador ${vereador.nome}`}
            className="perfil-foto"
          />
          <div className="perfil-info">
            <p className="perfil-cargo">
              {vereador.cargo} — Partido {vereador.partido}
            </p>
            <div className="info-contato">
              <h3>Dados do parlamentar</h3>
              <p>
                <strong>Partido: </strong>
                {vereador.partido}
              </p>
              <p>
                <strong>Mandato: </strong>
                {vereador.mandato}
              </p>
              <p>
                <strong>Comissão: </strong>
                {vereador.comissao}
              </p>
              <p>
                <strong>Gabinete: </strong>
                {partesGabinete[0]}
              </p>
              {partesGabinete[1] && (
                <p>
                  <strong>E-mail: </strong>
                  <a href={`mailto:${partesGabinete[1]}`}>{partesGabinete[1]}</a>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="info-contato">
          <h3>Biografia</h3>
          <p>{vereador.biografia}</p>
        </div>
        <div className="info-contato">
          <h3>Principais Projetos de Lei e Iniciativas</h3>
          <ul className="lista-projetos">
            {vereador.projetos.map((projeto, idx) => (
              <li key={idx}>{projeto}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="outros-vereadores">
        <h2>Outros vereadores</h2>
        <div className="lista-vereadores">
          {outrosVereadores.map((outro) => (
            <article key={outro.id} className="card-vereador">
              <img
                src={outro.foto}
                alt={`Foto do vereador ${outro.nome}`}
                className="foto-perfil"
              />
              <h3>{outro.nome}</h3>
              <p>
                <strong>Partido: </strong>
                {outro.partido}
              </p>
              <p className="cargo-vereador">{outro.cargo}</p>
              <Link
                className="btn-link btn-pagina"
                to={`/vereadores/${outro.id}`}
              >
                Ver página
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}