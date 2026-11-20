import { useState } from 'react';

const ITENS_MENU = [
  { id: 'todas', rotulo: 'Geral', caminho: '/' },
  { id: 'sobre', rotulo: 'Sobre', caminho: '/sobre' },
  { id: 'vereadores', rotulo: 'Vereadores', caminho: '/vereadores' },
  { id: 'noticias', rotulo: 'Notícias', caminho: '/noticias' },
  { id: 'sessoes', rotulo: 'Sessões', caminho: '/sessoes' },
  { id: 'contato', rotulo: 'Contato', caminho: '/contato' },
  { id: 'ouvidoria', rotulo: 'Ouvidoria', caminho: '/ouvidoria' },
];

export default function Sidebar({ secaoAtiva = 'todas', onSelecionarSecao }) {
  const [recolhida, setRecolhida] = useState(false);

  return (
    <nav
      className={`sidebar ${recolhida ? 'sidebar-recolhida' : ''}`}
      aria-label="Menu principal"
    >
      <button
        type="button"
        id="btn-menu"
        className="btn-menu"
        onClick={() => setRecolhida((ant) => !ant)}
      >
        {recolhida ? 'Mostrar menu' : 'Ocultar menu'}
      </button>
      <p className="titulo-sidebar">Seções</p>
      <ul>
        {ITENS_MENU.map((item) => (
          <li key={item.id}>
            <a
              href={item.caminho}
              className={secaoAtiva === item.id ? 'link-ativo' : ''}
              onClick={(e) => {
                if (onSelecionarSecao) {
                  e.preventDefault();
                  onSelecionarSecao(item.id);
                }
              }}
            >
              {item.rotulo}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}