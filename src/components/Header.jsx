import { useState, useEffect, useRef } from 'react';

export default function Header({
  temaEscuro,
  tamanhoFonte,
  onAlternarTema,
  onAlterarFonte,
  onRestaurarPadrao,
}) {
  const [painelAberto, setPainelAberto] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fecharAoClicarFora = () => {
      setPainelAberto(false);
    };

    document.addEventListener('click', fecharAoClicarFora);
    return () => {
      document.removeEventListener('click', fecharAoClicarFora);
    };
  }, []);

  const alternarPainel = (event) => {
    event.stopPropagation();
    setPainelAberto((anterior) => !anterior);
  };

  const impedirPropagacaoPainel = (event) => {
    event.stopPropagation();
  };

  return (
    <header>
      <div className="cabecalho-container">
        <img
          src="/Imagens/Buriti-do-codo.png"
          id="BuritiLogo"
          alt="Brasão da Câmara Municipal de Buriti do Codô"
        />
        <div className="cabecalho-texto">
          <h1>Câmara Municipal de Buriti do Codô</h1>
          <p id="subtitulo-camara">
            Trabalhando junto com a população por uma cidade melhor
          </p>
        </div>
      </div>

      <div className="config-container" ref={containerRef}>
        <button
          type="button"
          id="btn-config"
          className="btn-config"
          onClick={alternarPainel}
        >
          Configurações
        </button>

        <div
          id="painel-config"
          className={`painel-config ${painelAberto ? '' : 'oculto'}`}
          onClick={impedirPropagacaoPainel}
        >
          <div className="item-config">
            <span>Tema:</span>
            <button
              type="button"
              id="btn-tema"
              className="btn-acao"
              onClick={onAlternarTema}
            >
              {temaEscuro ? 'Modo Claro' : 'Modo Escuro'}
            </button>
          </div>

          <div className="item-config">
            <span>Fonte:</span>
            <div className="controles-fonte">
              <button
                type="button"
                id="btn-diminuir-fonte"
                className="btn-acao"
                onClick={() => onAlterarFonte(-2)}
              >
                A-
              </button>
              <span id="valor-fonte">{tamanhoFonte}px</span>
              <button
                type="button"
                id="btn-aumentar-fonte"
                className="btn-acao"
                onClick={() => onAlterarFonte(2)}
              >
                A+
              </button>
            </div>
          </div>

          <div className="item-config">
            <button
              type="button"
              id="btn-restaurar-config"
              className="btn-acao btn-restaurar"
              onClick={onRestaurarPadrao}
            >
              Restaurar padrão
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}