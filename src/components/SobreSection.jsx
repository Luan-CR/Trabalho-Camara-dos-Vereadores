import { useState, useEffect } from 'react';
import { buscarDadosCamara } from '../services/api.js';

export default function SobreSection() {
  const [dadosSobre, setDadosSobre] = useState(null);
  const [erro, setErro] = useState('');
  const [blocoDestacado, setBlocoDestacado] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    buscarDadosCamara(controller.signal)
      .then((dados) => {
        setDadosSobre(dados.sobre);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível carregar as informações institucionais.');
        }
      });
    return () => controller.abort();
  }, []);

  if (erro) {
    return (
      <section id="sobre">
        <h2>Sobre a Câmara</h2>
        <p className="mensagem-feedback">{erro}</p>
      </section>
    );
  }

  if (!dadosSobre) {
    return (
      <section id="sobre">
        <h2>Sobre a Câmara</h2>
        <p>Carregando informações institucionais...</p>
      </section>
    );
  }

  return (
    <section id="sobre">
      <h2>Sobre a Câmara</h2>
      {dadosSobre.paragrafos.map((paragrafo, idx) => (
        <p key={idx} className="mb-3">
          {paragrafo}
        </p>
      ))}
      <div className="grade-informativa">
        {dadosSobre.funcoes.map((funcao) => (
          <div
            key={funcao.id}
            className={`bloco-info ${
              blocoDestacado === funcao.id ? 'bloco-destaque' : ''
            }`}
            onMouseOver={() => setBlocoDestacado(funcao.id)}
            onMouseOut={() => setBlocoDestacado(null)}
          >
            <h3>{funcao.titulo}</h3>
            <p>{funcao.descricao}</p>
          </div>
        ))}
      </div>
      <div className="info-contato">
        <h3>Comissões Permanentes em Atividade (Biênio 2025-2026)</h3>
        {dadosSobre.comissoes.map((comissao, idx) => (
          <p key={idx}>
            <strong>{comissao.nome}:</strong> {comissao.descricao}
          </p>
        ))}
      </div>
    </section>
  );
}