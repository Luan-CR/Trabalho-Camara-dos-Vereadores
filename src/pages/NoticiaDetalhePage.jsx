import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarNoticiaPorId } from '../services/api.js';
import { incrementarNoticiasMarcadas } from '../utils/storage.js';

export default function NoticiaDetalhePage() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [outrasNoticias, setOutrasNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro('');

    buscarNoticiaPorId(id, controller.signal)
      .then(({ noticia: encontrada, todasNoticias }) => {
        if (!encontrada) {
          document.title =
            'Notícia não encontrada - Câmara Municipal de Buriti do Codô';
          setNoticia(null);
          setOutrasNoticias([]);
          return;
        }

        document.title = `${encontrada.titulo} - Câmara Municipal de Buriti do Codô`;
        incrementarNoticiasMarcadas();
        setNoticia(encontrada);

        const sugestoes = [];
        for (const outra of todasNoticias) {
          if (outra.id === encontrada.id || sugestoes.length >= 3) continue;
          sugestoes.push(outra);
        }
        setOutrasNoticias(sugestoes);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Falha ao buscar os detalhes da notícia via Fetch API.');
        }
      })
      .finally(() => {
        setCarregando(false);
      });

    return () => controller.abort();
  }, [id]);

  if (carregando) {
    return (
      <div id="conteudo-noticia">
        <p>Carregando matéria legislativa...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div id="conteudo-noticia">
        <Link to="/noticias" className="link-voltar">
          ← Voltar para as notícias
        </Link>
        <h2>Erro ao carregar notícia</h2>
        <p className="mensagem-feedback">{erro}</p>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div id="conteudo-noticia">
        <Link to="/noticias" className="link-voltar">
          ← Voltar para as notícias
        </Link>
        <h2>Notícia não encontrada</h2>
        <p>A notícia solicitada não existe ou foi removida.</p>
      </div>
    );
  }

  return (
    <div id="conteudo-noticia">
      <article className="pagina-noticia">
        <Link to="/noticias" className="link-voltar">
          ← Voltar para as notícias
        </Link>
        <p className="categoria-noticia">{noticia.cat}</p>
        <h2>{noticia.titulo}</h2>
        <p className="data-noticia">
          <time dateTime={noticia.iso}>{noticia.data}</time>
        </p>
        <p className="resumo-noticia">{noticia.resumo}</p>
        <h3>{noticia.rotulo}</h3>
        <p>{noticia.detalhe}</p>
      </article>

      <section className="outras-noticias">
        <h2>Outras notícias</h2>
        <ul className="lista-noticias">
          {outrasNoticias.map((outra) => (
            <li key={outra.id}>
              <h3>
                <Link to={`/noticias/${outra.id}`}>{outra.titulo}</Link>
              </h3>
              <p className="data-noticia">
                <time dateTime={outra.iso}>{outra.data}</time> — {outra.cat}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}