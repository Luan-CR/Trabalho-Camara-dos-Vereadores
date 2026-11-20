import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import {
  salvarLocal,
  obterLocal,
  inicializarPreferenciasLocais,
} from './utils/storage.js';

export default function App() {
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [totalVisitas, setTotalVisitas] = useState(1);
  const [ultimoAcesso, setUltimoAcesso] = useState('');
  const [ultimoVereadorConsultado, setUltimoVereadorConsultado] = useState('Nenhum');
  const [secaoAtiva, setSecaoAtiva] = useState('todas');

  useEffect(() => {
    const prefs = inicializarPreferenciasLocais();
    setTemaEscuro(prefs.temaEscuro);
    setTamanhoFonte(prefs.tamanhoFonte);
    setTotalVisitas(prefs.totalVisitas);
    setUltimoAcesso(prefs.ultimoAcesso);
    setUltimoVereadorConsultado(prefs.ultimoVereadorConsultado);
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

  const atualizarUltimoVereador = (nome) => {
    salvarLocal('ultimoVereadorConsultado', nome);
    setUltimoVereadorConsultado(obterLocal('ultimoVereadorConsultado', nome));
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
        <Sidebar secaoAtiva={secaoAtiva} onSelecionarSecao={setSecaoAtiva} />
        <main id="conteudo">
          <section>
            <h2>Layout Principal e Persistência Local Ativos</h2>
            <p>
              Cabeçalho, Painel de Configurações de Acessibilidade, Menu Lateral Retrátil,
              Rodapé e persistência das 5 chaves no localStorage configurados.
            </p>
          </section>
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