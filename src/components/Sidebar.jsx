import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { salvarSessao, registrarCliqueSessao } from '../utils/storage.js';

const ITENS_MENU = [
    { id: 'todas', rotulo: 'Geral', caminho: '/' },
    { id: 'sobre', rotulo: 'Sobre', caminho: '/sobre' },
    { id: 'vereadores', rotulo: 'Vereadores', caminho: '/vereadores' },
    { id: 'noticias', rotulo: 'Notícias', caminho: '/noticias' },
    { id: 'sessoes', rotulo: 'Sessões', caminho: '/sessoes' },
    { id: 'contato', rotulo: 'Contato', caminho: '/contato' },
    { id: 'ouvidoria', rotulo: 'Ouvidoria', caminho: '/ouvidoria' },
];

export default function Sidebar() {
    const [recolhida, setRecolhida] = useState(false);
    const location = useLocation();

    const handleNavegacao = (idSecao) => {
        salvarSessao('secaoAtiva', idSecao);
        registrarCliqueSessao();
    };

    const verificarAtivo = (item, isActive) => {
        if (item.id === 'vereadores' && location.pathname.startsWith('/vereadores')) {
            return true;
        }

        if (item.id === 'noticias' && location.pathname.startsWith('/noticias')) {
            return true;
        }

        return isActive;
    };

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
                        <NavLink
                            to={item.caminho}
                            end={item.caminho === '/'}
                            className={({ isActive }) =>
                                verificarAtivo(item, isActive) ? 'link-ativo' : ''
                            }
                            onClick={() => handleNavegacao(item.id)}
                        >
                            {item.rotulo}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}