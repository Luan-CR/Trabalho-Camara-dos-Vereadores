import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import {
    salvarLocal,
    obterLocal,
    inicializarPreferenciasLocais,
    inicializarDadosSessao,
} from './utils/storage.js';

function SecaoEmConstrucao({ titulo }) {
    return (
        <section>
            <h2>{titulo}</h2>
            <p>Rota SPA configurada via React Router DOM.</p>
        </section>
    );
}

export default function App() {
    const [temaEscuro, setTemaEscuro] = useState(false);
    const [tamanhoFonte, setTamanhoFonte] = useState(16);
    const [totalVisitas, setTotalVisitas] = useState(1);
    const [ultimoAcesso, setUltimoAcesso] = useState('');
    const [ultimoVereadorConsultado, setUltimoVereadorConsultado] = useState('Nenhum');

    useEffect(() => {
        const prefs = inicializarPreferenciasLocais();

        setTemaEscuro(prefs.temaEscuro);
        setTamanhoFonte(prefs.tamanhoFonte);
        setTotalVisitas(prefs.totalVisitas);
        setUltimoAcesso(prefs.ultimoAcesso);
        setUltimoVereadorConsultado(prefs.ultimoVereadorConsultado);

        inicializarDadosSessao();
    }, []);

    useEffect(() => {
        if (temaEscuro) {
            document.body.classList.add('tema-escuro');
        } else {
            document.body.classList.remove('tema-escuro');
        }

        salvarLocal('temaEscuro', temaEscuro ? 'sim' : 'nao');
    }, [temaEscuro]);

    useEffect(() => {
        document.body.style.fontSize = `${tamanhoFonte}px`;
        salvarLocal('tamanhoFonte', tamanhoFonte);
    }, [tamanhoFonte]);

    const alternarTema = () => {
        setTemaEscuro((anterior) => !anterior);
    };

    const alterarTamanhoFonte = (passo = 2) => {
        setTamanhoFonte((atual) => {
            let novo = atual + passo;

            if (novo < 12) novo = 12;
            if (novo > 22) novo = 22;

            return novo;
        });
    };

    const restaurarPadrao = () => {
        setTemaEscuro(false);
        setTamanhoFonte(16);
    };

    return (
        <div>
            <a href="#conteudo" className="pular-conteudo">
                Pular para o conteúdo
            </a>

            <Header
                temaEscuro={temaEscuro}
                tamanhoFonte={tamanhoFonte}
                onAlternarTema={alternarTema}
                onAlterarFonte={alterarTamanhoFonte}
                onRestaurarPadrao={restaurarPadrao}
            />

            <div className="pagina-container">
                <Sidebar />

                <main id="conteudo">
                    <Routes>
                        <Route
                            path="/"
                            element={<SecaoEmConstrucao titulo="Visão Geral do Portal" />}
                        />
                        <Route
                            path="/sobre"
                            element={<SecaoEmConstrucao titulo="Sobre a Câmara" />}
                        />
                        <Route
                            path="/vereadores"
                            element={<SecaoEmConstrucao titulo="Vereadores" />}
                        />
                        <Route
                            path="/noticias"
                            element={<SecaoEmConstrucao titulo="Notícias" />}
                        />
                        <Route
                            path="/sessoes"
                            element={<SecaoEmConstrucao titulo="Últimas Sessões" />}
                        />
                        <Route
                            path="/contato"
                            element={<SecaoEmConstrucao titulo="Contato" />}
                        />
                        <Route
                            path="/ouvidoria"
                            element={<SecaoEmConstrucao titulo="Fale Conosco - Ouvidoria" />}
                        />
                    </Routes>
                </main>
            </div>

            <Footer
                totalVisitas={totalVisitas}
                ultimoAcesso={ultimoAcesso}
                ultimoVereadorConsultado={ultimoVereadorConsultado}
            />
        </div>
    );
}