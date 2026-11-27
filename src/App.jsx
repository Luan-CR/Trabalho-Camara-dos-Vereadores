import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import VereadorDetalhePage from './pages/VereadorDetalhePage.jsx';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import SobreSection from './components/SobreSection.jsx';
import ContatoSection from './components/ContatoSection.jsx';
import NoticiaDetalhePage from './pages/NoticiaDetalhePage.jsx';
import NoticiasSection from './components/NoticiasSection.jsx';
import SessoesSection from './components/SessoesSection.jsx';
import VereadoresSection from './components/VereadoresSection.jsx';
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
      <p>Seção integrada ao roteamento SPA.</p>
    </section>
  );
}

export default function App() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [totalVisitas, setTotalVisitas] = useState(1);
  const [ultimoAcesso, setUltimoAcesso] = useState('');
  const [ultimoVereadorConsultado, setUltimoVereadorConsultado] = useState('Nenhum');
  const location = useLocation();

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (
      !location.pathname.startsWith('/noticias/') &&
      !location.pathname.startsWith('/vereadores/')
    ) {
      document.title = 'Câmara Municipal de Buriti do Codô';
    }
  }, [location.pathname]);

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

  const atualizarUltimoVereador = useCallback((nome) => {
    salvarLocal('ultimoVereadorConsultado', nome);
    setUltimoVereadorConsultado(obterLocal('ultimoVereadorConsultado', nome));
  }, []);

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
              element={
                <>
                  <SobreSection />
                  <VereadoresSection
                    onVereadorConsultado={atualizarUltimoVereador}
                  />
                  <NoticiasSection />
                  <SessoesSection />
                  <ContatoSection />
                </>
              }
            />
            <Route path="/sobre" element={<SobreSection />} />
         <Route
           path="/vereadores"
           element={
             <VereadoresSection
               onVereadorConsultado={atualizarUltimoVereador}
             />
           }
         />
           <Route
              path="/vereadores/:id"
              element={
                <VereadorDetalhePage
                  onVereadorConsultado={atualizarUltimoVereador}
                />
              }
            />
            <Route path="/noticias" element={<NoticiasSection />}/>
            <Route path="/noticias/:id" element={<NoticiaDetalhePage />} />
            <Route path="/sessoes" element={<SessoesSection/>}/>
            <Route path="/contato" element={<ContatoSection />} />
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