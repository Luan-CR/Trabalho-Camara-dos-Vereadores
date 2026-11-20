import { useState, useEffect } from 'react';
import { buscarDadosCamara } from '../services/api.js';

export default function ContatoSection() {
  const [dadosContato, setDadosContato] = useState(null);
  const [erro, setErro] = useState('');
  const [setorDestacado, setSetorDestacado] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    buscarDadosCamara(controller.signal)
      .then((dados) => {
        setDadosContato(dados.contato);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível carregar os dados de contato.');
        }
      });
    return () => controller.abort();
  }, []);

  if (erro) {
    return (
      <section id="contato">
        <h2>Contato</h2>
        <p className="mensagem-feedback">{erro}</p>
      </section>
    );
  }

  if (!dadosContato) {
    return (
      <section id="contato">
        <h2>Contato</h2>
        <p>Carregando canais de atendimento...</p>
      </section>
    );
  }

  return (
    <section id="contato">
      <h2>Contato</h2>
      <p className="descricao-secao">
        A Câmara Municipal de Buriti do Codô está de portas abertas para atender a
        população. Confira abaixo o endereço da sede, horários de expediente e os contatos
        diretos de cada setor administrativo.
      </p>
      <div className="info-contato">
        <h3>Sede do Poder Legislativo</h3>
        <p>
          <strong>Endereço:</strong> {dadosContato.sede.endereco}
        </p>
        <p>
          <strong>Telefone Geral (PABX):</strong> {dadosContato.sede.telefone}
        </p>
        <p>
          <strong>E-mail Institucional:</strong> {dadosContato.sede.email}
        </p>
        <p>
          <strong>Horário de Atendimento:</strong> {dadosContato.sede.horario}
        </p>
      </div>
      <div className="grade-informativa">
        {dadosContato.setores.map((setor) => (
          <div
            key={setor.id}
            className={`bloco-info ${
              setorDestacado === setor.id ? 'bloco-destaque' : ''
            }`}
            onMouseOver={() => setSetorDestacado(setor.id)}
            onMouseOut={() => setSetorDestacado(null)}
          >
            <h3>{setor.titulo}</h3>
            <p>{setor.descricao}</p>
            <p>
              <strong>Ramal:</strong> {setor.ramal} | <strong>E-mail:</strong>{' '}
              {setor.email}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}