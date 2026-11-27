import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buscarNoticias } from '../services/api.js';
import { obterSessao, salvarSessao } from '../utils/storage.js';
import StatusCarregamento from './StatusCarregamento.jsx';

export default function NoticiasSection() {
  const [noticias, setNoticias] = useState([]);
  const [termoBusca, setTermoBusca] = useState(() =>
    obterSessao('termoBuscaNoticia', '')
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    buscarNoticias(controller.signal)
      .then((lista) => {
        setNoticias(lista);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível carregar o mural de notícias.');
        }
      })
      .finally(() => {
        setCarregando(false);
      });
    return () => controller.abort();
  }, []);

  const handleBuscaChange = (event) => {
    const novoTermo = event.target.value;
    setTermoBusca(novoTermo);
    salvarSessao('termoBuscaNoticia', novoTermo.toLowerCase().trim());
  };

  const termoLimpo = termoBusca.toLowerCase().trim();
  const noticiasFiltradas = noticias.filter((item) => {
    if (!termoLimpo) return true;
    const texto = `${item.titulo} ${item.resumo} ${item.cat}`.toLowerCase();
    return texto.indexOf(termoLimpo) !== -1;
  });

  return (
    <section id="noticias">
      <h2>Notícias</h2>
      <p className="descricao-secao">
        Acompanhe as ações, votações, visitas técnicas e audiências públicas realizadas
        pela Câmara Municipal. Você pode pesquisar por palavras-chave e clicar em{' '}
        <strong>Ler mais</strong> para abrir a matéria completa sem recarregar a página.
      </p>
      <div className="barra-filtros">
        <input
          type="text"
          id="busca-noticia"
          placeholder="Pesquisar nas notícias por palavra-chave..."
          value={termoBusca}
          onChange={handleBuscaChange}
        />
      </div>
      <StatusCarregamento
        carregando={carregando}
        erro={erro}
        mensagemCarregando="Carregando notícias legislativas..."
      />
      {!carregando && !erro && (
        <>
          <p id="contador-noticias" className="contador-resultados">
            Exibindo {noticiasFiltradas.length} de {noticias.length} notícias publicadas.
          </p>
          <ul className="lista-noticias">
            {noticiasFiltradas.map((noticia) => (
              <li key={noticia.id}>
                <h3>
                  <Link to={`/noticias/${noticia.id}`}>{noticia.titulo}</Link>
                </h3>
                <p>{noticia.resumo}</p>
                <p className="data-noticia">
                  <time dateTime={noticia.iso}>{noticia.data}</time> {noticia.cat}
                </p>
                <Link
                  className="btn-link btn-ler-noticia"
                  to={`/noticias/${noticia.id}`}
                >
                  Ler mais
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}