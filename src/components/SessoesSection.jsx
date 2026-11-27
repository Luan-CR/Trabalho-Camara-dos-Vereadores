import { useState, useEffect } from 'react';
import { buscarSessoes } from '../services/api.js';
import { obterSessao, salvarSessao } from '../utils/storage.js';
import StatusCarregamento from './StatusCarregamento.jsx';

export default function SessoesSection() {
  const [sessoes, setSessoes] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState(() =>
    obterSessao('filtroTipoSessao', 'todas')
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    buscarSessoes(controller.signal)
      .then((lista) => {
        setSessoes(lista);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setErro('Não foi possível carregar o cronograma de sessões.');
        }
      })
      .finally(() => {
        setCarregando(false);
      });
    return () => controller.abort();
  }, []);

  const handleFiltroChange = (event) => {
    const novoTipo = event.target.value;
    setTipoFiltro(novoTipo);
    salvarSessao('filtroTipoSessao', novoTipo);
  };

  const sessoesFiltradas = sessoes.filter((sessao) => {
    if (tipoFiltro === 'todas') return true;
    return sessao.tipo === tipoFiltro;
  });

  return (
    <section id="sessoes">
      <h2>Últimas sessões</h2>
      <p className="descricao-secao">
        Consulte o cronograma e o resultado das deliberações em plenário. As{' '}
        <strong>Sessões Ordinárias</strong> ocorrem semanalmente às quintas-feiras, às 9h,
        para votação da pauta regular, enquanto as{' '}
        <strong>Sessões Extraordinárias</strong> são convocadas para matérias de caráter
        urgente.
      </p>
      <div className="barra-filtros">
        <select id="filtro-sessao" value={tipoFiltro} onChange={handleFiltroChange}>
          <option value="todas">Todas as sessões</option>
          <option value="Ordinária">Somente Ordinárias</option>
          <option value="Extraordinária">Somente Extraordinárias</option>
        </select>
      </div>
      <StatusCarregamento
        carregando={carregando}
        erro={erro}
        mensagemCarregando="Carregando sessões plenárias..."
      />
      {!carregando && !erro && (
        <>
          <p id="contador-sessoes" className="contador-resultados">
            Exibindo {sessoesFiltradas.length} de {sessoes.length} sessões plenárias.
          </p>
          <div className="tabela-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Horário</th>
                  <th scope="col">Assunto principal</th>
                  <th scope="col">Resultado</th>
                </tr>
              </thead>
              <tbody>
                {sessoesFiltradas.map((sessao) => (
                  <tr key={sessao.id}>
                    <td>{sessao.data}</td>
                    <td>{sessao.tipo}</td>
                    <td>{sessao.horario}</td>
                    <td>{sessao.assunto}</td>
                    <td>{sessao.resultado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}